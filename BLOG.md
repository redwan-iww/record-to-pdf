# How I built `record-to-pdf`: turning CRM JSON into branded PDFs (and what I learned along the way)

*A walkthrough for my junior devs — read this before you touch the repo.*

---

Hey 👋

So we ship this thing called **record-to-pdf**. It takes a JSON blob out of our CRM and spits out a nicely-branded Hipoteken mortgage-simulation PDF. Three pages, orange accents, logos in the right spots, the whole deal.

Sounds boring, right? "Just generate a PDF." It's not. PDFs are where good intentions go to die. I want to walk you through how this project is built, *why* it's built that way, and the little traps I fell into so you don't have to.

By the end of this post you should be able to open the repo, find any file, and know roughly why it exists.

---

## The problem

Marketing/sales want to hand a client a beautiful PDF summarising their mortgage simulation. The numbers live in the CRM. We get the record as JSON. We need to:

1. Turn that JSON into a three-page A4 document.
2. Match the brand (specific orange, specific logo, specific icon set).
3. Do it fast enough that a human clicking "Download" in the UI doesn't get bored.
4. Also handle *bulk* rendering — thousands of these, triggered by webhooks.

Points 3 and 4 pull in opposite directions. That tension shapes the whole architecture.

---

## Picking the renderer

First decision: how do you render a PDF?

Options I considered:

- **A PDF library** (pdfkit, PDFLib). Draw boxes and text directly. Fast, tiny memory footprint. But laying out a branded, pixel-perfect design by positioning `(x, y)` rectangles is pain. Changing the design later is even more pain.
- **LaTeX**. Lol no.
- **Headless Chromium via Puppeteer.** Write HTML + CSS, print to PDF. Slower, heavier, but I already know CSS and so does every designer on earth. Changes take minutes.

I picked **Puppeteer**. The design-velocity win crushed the runtime cost. A render takes ~1–3 seconds. Chromium eats ~200MB of RAM. Both acceptable.

**Junior-dev takeaway:** choose the tool that makes the *changes you'll make 100 times* cheap, not the one that makes the *hot path* fastest. Layout changes happen weekly. Renders happen in the background.

---

## Three entry points, one renderer

Open the repo and you'll see three files at the root:

```
generate.js   # CLI
server.js     # HTTP API
worker.js     # queue consumer
```

All three funnel into the same function:

```js
import { generatePdf } from "./src/pdf/index.js";

const pdfBuffer = await generatePdf(crmRecord);
```

This is the most important pattern in the codebase. **Write the core as a plain function. Wrap it in as many transports as you need.** CLI, sync HTTP, async worker — they all do the same thing: feed a record in, get bytes out. The transport is the boring part.

If you need to add a fourth entry point tomorrow (an AWS Lambda, a Slack bot, whatever), you import `generatePdf` and you're done.

---

## The rendering core — `src/pdf/`

This is where the actual work happens. Let me walk you through it top-down.

### `browser.js` — don't launch Chromium every time

Naive version:

```js
async function generatePdf(data) {
  const browser = await puppeteer.launch();   // 🐌 ~1 second
  const page = await browser.newPage();
  // ... render
  await browser.close();
}
```

That cold-start kills you. So we keep Chromium alive:

```js
let browserPromise;
export function getBrowser() {
  if (!browserPromise) browserPromise = puppeteer.launch({...});
  return browserPromise;
}
```

First call launches. Every call after reuses. On shutdown, `closeBrowser()` tears it down.

**Takeaway:** expensive resources (browsers, DB connections, HTTP clients) get a singleton. Lazy-init on first use, close on shutdown. Don't wrap it in a class if a closure does the job.

### `template.js` — one big function that builds HTML

`buildHTML(data)` returns a full HTML document — three `<section class="page">` blocks, embedded CSS, inline SVGs. It's ~400 lines. It's not pretty. It's *fine*.

I resisted the urge to reach for React or Handlebars. Why?

- The output is a **string**. Not a tree, not a component hierarchy — a string that Puppeteer will parse once and throw away.
- There's one template. It's never reused.
- Every abstraction I added made the code *harder* to match to the PDF on screen.

Template strings and small composition helpers (below) beat a framework here.

### `components.js` — tiny helpers, not components

```js
export const box = (content) => `<div class="box">${content}</div>`;
export const row = (left, right, opts = {}) => `...`;
export const infoBar = (date, preparedBy, customer) => `...`;
```

These aren't React components. They're string functions. They exist because writing `<div class="box">` seventy times is worse than writing `box(...)` seventy times.

**Takeaway:** helpers earn their keep by removing repetition, not by looking fancy. If a helper only gets called once, delete it.

### `format.js` — formatters in one place

```js
fmt(250000)          // → "€ 250,000.00"
pct(0.7)             // → "70%"
fmtDate("2026-01-15") // → "15-01-2026"
```

Formatting bugs are the #1 source of PDF embarrassment. ("Why does the client's name have `€…` on the end??" — because the CRM stuffs it there and I hadn't cleaned it up yet.) Centralising formatters means *one* place to fix a bug, *one* place to add a locale later.

### `icons.js` — inline SVGs, read once at boot

SVGs in `assets/` get slurped into memory at import time. Why?

- Puppeteer + external file URLs + Windows = a bad time.
- Inlining SVG means the renderer never waits on a network or filesystem round-trip mid-render.
- A tiny quirk: some of our SVGs had `<style>` tags that Chromium's print renderer sometimes ignored. So we rewrite them to inline `fill="..."` attributes on load. Set-and-forget.

This is the kind of "seems like over-engineering until it isn't" detail you'll see a lot in production code. Write it once, comment the *why*, move on.

---

## Transport #1: the CLI

```js
// generate.js
const data = JSON.parse(fs.readFileSync(dataPath));
const buf = await generatePdf(data);
fs.writeFileSync(outPath, buf);
await closeBrowser();
```

Seven lines of real logic. Useful for:

- Local testing ("did I break the layout?")
- One-off batch jobs via a shell loop
- Debugging weird records in isolation

If you're a junior dev onboarding, **start here**. Run `npm run generate`. Open `output.pdf`. You now understand 80% of what the project does.

---

## Transport #2: sync HTTP

```js
app.post("/pdf", async (req, res) => {
  const buf = await generatePdf(req.body);
  res.type("application/pdf").send(buf);
});
```

That's it. Client posts a CRM record, gets PDF bytes back. Blocks for 1–3 s.

This is the endpoint the UI calls when a human clicks a button. Humans are fine waiting 2 seconds. They are *not* fine polling.

---

## Transport #3: async HTTP + queue (the interesting one)

Here's where it gets fun. Imagine 500 webhooks fire at once. If each blocks the HTTP server for 2 seconds, your server dies. You need a queue.

```
client ──POST /jobs──▶ server.submit() ──publish──▶ [pdf-jobs queue]
       ◀─202 {id}────                                     │
                                                          ▼
                                                      worker.consume()
                                                          │
                                                   generatePdf(data)
                                                          │
                                                          ▼
                               [server's exclusive reply queue]
                                          │
                                          ▼
                              jobStore updates Map[id]
```

We use **RabbitMQ** because it's battle-tested and we already run it. You could argue for BullMQ or a cloud queue. All fine. The pattern is what matters.

### The "RPC over a queue" trick

Here's something that tripped me up and will probably trip you up.

RabbitMQ doesn't store "results by job id" like BullMQ does. It's a pure message broker. When the worker finishes rendering, where does the result go?

The answer is the **RPC pattern**:

1. Server boots. Asserts an **exclusive, auto-delete reply queue** (unique per server instance).
2. Server starts consuming that reply queue.
3. When a client posts to `/jobs`:
   - Server generates a UUID `correlationId`.
   - Stores `{status: "queued"}` in an in-memory `Map`.
   - Publishes the job with `replyTo: <reply queue>` and the correlation id.
4. Worker does its thing. Publishes the result back to `replyTo` with the same correlation id.
5. Server's consumer picks it up, looks up the id in the Map, updates the entry to `{status: "completed", pdf: ...}`.
6. Client polls `GET /jobs/:id`, server reads the Map.

**The gotcha:** results live in-memory on the *specific server instance* that accepted the job. If you run two server replicas behind a load balancer and the poll hits the wrong one, you get `not found`. Fixes: sticky sessions, or swap the Map for Redis. We don't need multi-instance yet, so we flag it in a comment and move on.

**Takeaway:** don't paint yourself into a corner you haven't hit yet, but *mark the corner*. A single-line comment or a README note ("this won't scale past one server instance") is enough. Future-you will thank present-you.

### DLX / DLQ — failed jobs don't vanish

```
[queue: pdf-jobs] ──(on nack)──▶ [exchange: pdf-jobs.dlx] ──▶ [queue: pdf-jobs.dlq]
```

If a render throws, the worker `nack`s the message. RabbitMQ routes it to a dead-letter queue. We can inspect `pdf-jobs.dlq` in the management UI at `localhost:15672` to see *what* crashed and *why*.

Without this, bad messages would either silently disappear or loop forever. Set up DLQs the day you set up any queue. It costs 10 lines of config and saves your weekend.

---

## Config in one place — `src/config.js`

```js
export const PORT = parseInt(process.env.PORT ?? "3000", 10);
export const API_KEY = process.env.API_KEY;
export const RABBIT_URL = process.env.RABBIT_URL ?? "amqp://localhost:5672";
// ...
```

Every `process.env.X` read happens here. Other modules import constants. If you're adding a new setting, it goes here first.

Why? Grep-ability and one-shot testing. If I want to know every setting this service respects, I read one file.

---

## What I'd do differently if I started today

A few honest notes:

- **The in-memory job store is a hack.** Works for single-instance. Put Redis in front of it the moment we deploy a second replica.
- **No tests.** (Yet.) The right move is a snapshot test of `buildHTML()` output (just compare the HTML string) and a smoke test of `generatePdf()` on a fixed record. Fast, catches 90% of regressions.
- **The template is monolithic.** 400 lines isn't terrible but I'd probably split per-page functions (`page1(data)`, `page2(data)`, `page3(data)`) if it grows much more.
- **No structured logging.** `console.log` is fine for now; when this runs in prod behind a real log aggregator, swap in `pino`.

None of these are blockers. All of them are *yet*-problems.

---

## What to read if you're onboarding

In this order:

1. `README.md` — one-pager, how to run it.
2. `generate.js` — the simplest consumer. Run it. Open the PDF.
3. `src/pdf/index.js` → `template.js` → `components.js`. Now you know how the PDF is made.
4. `server.js` → `src/routes/pdf.js`. Now you know the sync API.
5. `worker.js` + `src/queue/jobStore.js`. Now you know the async flow.
6. `WALKTHROUGH.md` — the deep dive, for when you're doing something non-trivial.

You'll be productive in a day.

---

## The meta-lessons

If you remember nothing else from this post:

1. **Write your core as a plain function.** Wrap it in transports later.
2. **Expensive resources get lazy singletons.** Browsers, DB pools, HTTP clients.
3. **Centralise formatting and config.** One file to grep.
4. **Set up DLQs the moment you set up queues.**
5. **Mark the corners you haven't painted into yet.** A comment is cheap.
6. **Pick tools that make the changes you'll make 100 times cheap**, not the ones that are theoretically faster.

That's it. Open a PR, break something, learn, fix it. That's the job.

Catch you in review 👊

— *[Your name here]*

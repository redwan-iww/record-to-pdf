# Full walkthrough — record-to-pdf

A service that renders Hipoteken mortgage-simulation PDFs from CRM records. Three ways to use it: CLI, sync HTTP, async HTTP+queue.

---

## 1. Project tree

```
record-to-pdf/
├── assets/                  # 9 svg icons used in the pdf
├── example_data/            # sample inputs
├── data.json                # default CLI input (a CRM record)
├── src/
│   ├── config.js            # env + constants
│   ├── middleware/
│   │   └── auth.js          # api-key guard
│   ├── pdf/                 # everything pdf rendering
│   │   ├── index.js         # public entry: generatePdf()
│   │   ├── browser.js       # puppeteer singleton
│   │   ├── template.js      # buildHTML(d) → 3-page document
│   │   ├── components.js    # html snippets (box, row, infoBar, …)
│   │   ├── format.js        # fmt, pct, fmtDate, customerName
│   │   ├── icons.js         # loads svg icons from /assets
│   │   └── logos.js         # hipoteken logo svgs
│   ├── queue/               # rabbitmq plumbing
│   │   ├── rabbit.js        # connection + channel + DLX/DLQ setup
│   │   └── jobStore.js      # in-memory job cache + reply listener
│   └── routes/              # express routes
│       ├── health.js
│       ├── pdf.js           # POST /pdf   (sync)
│       └── jobs.js          # POST /jobs, GET /jobs/:id, /jobs/:id/pdf
├── server.js                # entry: http api
├── worker.js                # entry: queue consumer
├── generate.js              # entry: CLI
└── package.json
```

Three entrypoints at root. Everything they use is in `src/`.

---

## 2. The rendering core — `src/pdf/`

This is the heart. Everything else is plumbing around it.

### `src/pdf/browser.js`
Keeps a single Puppeteer browser alive. First call launches Chromium (~1s), subsequent calls reuse it.
```js
getBrowser()   // returns the running browser, launches if needed
closeBrowser() // shuts it down on exit
```
Huge win: without this, every PDF would cold-start Chromium.

### `src/pdf/icons.js`
At import time, reads all 9 SVGs from `assets/`, inlines their fill colors (they ship with `<style>` blocks that Puppeteer/print doesn't always honor), and exposes them as an `icons` object. Happens once per process.

### `src/pdf/logos.js`
Two hardcoded logo SVGs. `logo(height)` and `logoPage1(height)` resize them on demand by rewriting `width`/`height` attributes.

### `src/pdf/format.js`
Tiny formatting helpers:
- `fmt(n)` → `€ 250,000.00`
- `pct(n)` → `70%`
- `fmtDate(iso)` → `dd-mm-yyyy`
- `customerName(name)` → strips the `€...` noise from CRM names.

### `src/pdf/components.js`
HTML-snippet functions that compose the document:
- `infoBar(date, preparedBy, customer)` — top strip on each page
- `box(content)` — rounded orange-bordered card
- `boxHdr(text)` — bold underlined header inside a box
- `row(left, right, opts)` — label-value line with `bold`/`topBorder`/`orangeText`/`tab` flags
- `iconCell`, `nextSteps`, `hint` — smaller pieces

### `src/pdf/template.js`
One big function: `buildHTML(d)`. Takes a CRM record, returns a full HTML document with three A4 pages (Briefing / Monthly repayments / Purchase & mortgage costs) plus a disclaimer. Uses everything above.

### `src/pdf/index.js` — the public entry
```js
import { generatePdf, closeBrowser } from "./src/pdf/index.js";

const pdfBuffer = await generatePdf(crmRecord);
```
Internals:
```js
async function generatePdf(data) {
  const html = buildHTML(data);
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setContent(html, { waitUntil: "networkidle0" });
    return await page.pdf({ format: "A4", printBackground: true, margin: 0s });
  } finally {
    await page.close();
  }
}
```
Every other entry point calls this.

---

## 3. Config — `src/config.js`

All env reads in one place:
```
PORT, API_KEY, RABBIT_URL, QUEUE_NAME, DLX, DLQ,
PDF_CONCURRENCY, JOB_TTL_MS
```
Any module that needs a setting imports from here. No `process.env.X` scattered elsewhere.

---

## 4. Entry 1 — CLI (`generate.js`)

Simplest consumer. Reads `data.json`, writes `output.pdf`.
```bash
npm run generate                         # data.json → output.pdf
node generate.js input.json result.pdf   # custom paths
```
```js
const data = JSON.parse(fs.readFileSync(dataPath));
const buf = await generatePdf(data);
fs.writeFileSync(outPath, buf);
await closeBrowser();
```
No network, no queue. Good for local testing and batch scripts.

---

## 5. Entry 2 — HTTP server (`server.js`)

Express app with three route groups.

```js
app.use(express.json({ limit: "5mb" }));
app.use(apiKey);                 // src/middleware/auth.js
app.use(healthRoutes);           // GET  /health
app.use(pdfRoutes);              // POST /pdf           (sync)
app.use(jobRoutes);              // POST /jobs, GET /jobs/:id, /jobs/:id/pdf

await jobStore.init();           // connect to rabbit, open reply queue
app.listen(PORT, ...);
```

### Middleware — `src/middleware/auth.js`
If `API_KEY` env var is set, every request (except `/health`) must send matching `x-api-key` header. If unset, middleware is a no-op — dev-friendly.

### Routes

**`src/routes/health.js`** — `GET /health` → `{ok:true}`. For load balancers.

**`src/routes/pdf.js`** — `POST /pdf`
```
body: CRM record JSON
→ 200 application/pdf (bytes)
```
Blocks the HTTP connection until render finishes (1–3s). Best for a user clicking "Download PDF" in a UI.

**`src/routes/jobs.js`** — three endpoints for async flow:

1. `POST /jobs` → enqueues via `jobStore.submit(body)`, returns `202 {id}` immediately.
2. `GET /jobs/:id` → returns `{status}` plus `pdf` (base64) when complete or `error` when failed.
3. `GET /jobs/:id/pdf` → streams raw PDF bytes if complete, `409` otherwise.

Best for webhooks (caller can't wait) or bulk jobs.

### Graceful shutdown
On `SIGINT`/`SIGTERM`: stops accepting new HTTP, closes the job-store channel, closes RabbitMQ connection, closes the browser.

---

## 6. Entry 3 — Worker (`worker.js`)

Consumes the queue. Separate process so you can scale it independently of the API.

```js
const channel = await createChannel();
await channel.prefetch(PDF_CONCURRENCY);  // e.g. 2 in-flight per worker

channel.consume(QUEUE_NAME, async (msg) => {
  const { data } = JSON.parse(msg.content);
  try {
    const buf = await generatePdf(data);
    channel.sendToQueue(msg.properties.replyTo,
      JSON.stringify({ ok: true, pdfBase64: buf.toString("base64") }),
      { correlationId: msg.properties.correlationId });
    channel.ack(msg);
  } catch (err) {
    channel.sendToQueue(msg.properties.replyTo,
      JSON.stringify({ ok: false, error: err.message }),
      { correlationId: msg.properties.correlationId });
    channel.nack(msg, false, false);  // → DLQ
  }
});
```

Each job: parse → render → reply to the server's reply queue → ack. Failures reply with the error and dead-letter the message.

---

## 7. RabbitMQ plumbing — `src/queue/`

### `src/queue/rabbit.js`

- `connect()` (internal) — lazy singleton connection with reconnect logging on close/error.
- `close()` — for shutdown.
- `createChannel()` — opens a channel and asserts the full topology:
  ```
  [queue: pdf-jobs] ──(on nack)──▶ [exchange: pdf-jobs.dlx] ──▶ [queue: pdf-jobs.dlq]
  ```
  Durable queue + DLX so failed jobs don't vanish — you can inspect `pdf-jobs.dlq` in the management UI.

### `src/queue/jobStore.js` — the RPC trick

RabbitMQ doesn't store "job results by id" like BullMQ does. So the server implements the RPC pattern:

On `init()`:
1. Opens a channel.
2. Asserts an **exclusive, auto-delete reply queue** (unique per server instance).
3. Consumes that reply queue. When a message arrives, writes the result into an in-memory `Map` keyed by `correlationId`.
4. Starts a 60-second sweeper that evicts entries older than `JOB_TTL_MS`.

`submit(data)`:
1. Generates a UUID correlationId.
2. Records `{status:"queued"}` in the Map.
3. Publishes the message to `pdf-jobs` with `persistent: true`, `correlationId`, and `replyTo: <this server's reply queue>`.
4. Returns the id.

`get(id)`: plain Map lookup.

Tradeoff: jobs submitted to server A can only be polled from server A. Multi-instance needs sticky sessions or a shared store (Redis). Called out in the jobs.js comments; good enough for single-server setups.

---

## 8. End-to-end flows

### A. CLI
```
generate.js → generatePdf(data) → buildHTML → puppeteer → output.pdf
```

### B. Sync HTTP
```
client ──POST /pdf──▶ server ──generatePdf──▶ puppeteer
                       ◀─── application/pdf ───
```
Single process renders while the HTTP connection waits. No queue involved.

### C. Async HTTP + worker
```
client ──POST /jobs──▶ server.submit() ──publish──▶ [pdf-jobs queue]
       ◀─202 {id}────                                     │
                                                          ▼
                                                       worker.consume()
                                                          │
                                                          ├─ generatePdf(data)
                                                          │
                                                          ▼
                              [server's exclusive reply queue]
                                          │
                                          ▼
                               jobStore updates Map[id]
                                          │
client ──GET /jobs/:id──▶ server reads Map[id] ──▶ { status:"completed", pdf:"…" }
client ──GET /jobs/:id/pdf──▶ server streams bytes
```

Worker and server are separate processes; multiple workers can consume from the same queue.

---

## 9. Running it

```bash
# dev: just the CLI
npm run generate

# sync API (no queue needed, no rabbitmq)
#   — but server.js currently calls jobStore.init() at boot,
#     so you still need rabbit running for the server itself
docker run -d -p 5672:5672 -p 15672:15672 rabbitmq:3-management
npm run server   # terminal 1
npm run worker   # terminal 2
```

Env:
```
PORT=3000
API_KEY=<optional, sets auth>
RABBIT_URL=amqp://localhost:5672
PDF_QUEUE=pdf-jobs
PDF_CONCURRENCY=2
JOB_TTL_MS=3600000
```

---

## 10. What's where — cheat sheet

| Want to… | File |
|---|---|
| Change the PDF layout / content | `src/pdf/template.js` |
| Change colors / fonts | `src/pdf/template.js` (CSS), `src/pdf/components.js` (`ORANGE`, `BOX_BORDER`) |
| Swap a helper (currency, date) | `src/pdf/format.js` |
| Add a new icon | drop SVG in `assets/`, add key in `src/pdf/icons.js`, use in `template.js` |
| Add a new HTTP route | new file in `src/routes/`, mount in `server.js` |
| Change Puppeteer args | `src/pdf/browser.js` |
| Change queue options / retries / DLQ | `src/queue/rabbit.js` |
| Change result cache TTL | `JOB_TTL_MS` env, read in `src/config.js` |
| Change API auth | `src/middleware/auth.js` |
| Handle failures differently | worker's catch block in `worker.js` |

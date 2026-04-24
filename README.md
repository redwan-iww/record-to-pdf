# record-to-pdf

Generate Hipoteken mortgage-simulation PDFs from CRM records.

Three ways to use it:

- **CLI** — read a JSON file, write a PDF.
- **Sync HTTP** — `POST /pdf`, get bytes back.
- **Async HTTP + queue** — `POST /jobs`, poll for the result. Backed by RabbitMQ so renders can be processed by a pool of workers.

## Requirements

- Node.js 20+
- RabbitMQ (only for the HTTP server + worker)
- The bundled Chromium from Puppeteer (installed automatically on `npm install`)

## Install

```bash
npm install
```

## Quick start

### CLI

```bash
npm run generate                         # data.json → output.pdf
node generate.js input.json result.pdf   # custom paths
```

### HTTP server + worker

```bash
# start rabbitmq (management UI on http://localhost:15672, guest/guest)
docker run -d --name rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management

npm run server    # terminal 1 — http api on :3000
npm run worker    # terminal 2 — queue consumer
```

## HTTP API

### `GET /health`
Liveness check.
```
→ 200 { "ok": true }
```

### `POST /pdf` — sync
Renders the PDF immediately and streams the bytes back.
```
POST /pdf
Content-Type: application/json
body: CRM record JSON

→ 200 application/pdf  <binary>
```
Good for interactive downloads. Blocks the HTTP connection for 1–3 s.

### `POST /jobs` — async enqueue
Queues the render, returns a job id instantly.
```
POST /jobs
Content-Type: application/json
body: CRM record JSON

→ 202 { "id": "uuid", "status": "queued" }
```

### `GET /jobs/:id` — poll status
```
→ { "id": "…", "status": "queued"    }
→ { "id": "…", "status": "active"    }
→ { "id": "…", "status": "completed", "pdf": "<base64>" }
→ { "id": "…", "status": "failed",    "error": "…"       }
```

### `GET /jobs/:id/pdf` — download bytes
Raw PDF when `completed`, `409` otherwise.
```
→ 200 application/pdf  <binary>
→ 409 { "status": "active" }
```

### Auth

If `API_KEY` is set, all routes except `/health` require a matching `x-api-key` header. If `API_KEY` is unset the check is skipped (useful for local dev).

## Environment

| Var | Default | Purpose |
|---|---|---|
| `PORT` | `3000` | HTTP port |
| `API_KEY` | — | Optional API key; enables auth middleware |
| `RABBIT_URL` | `amqp://localhost:5672` | RabbitMQ connection URL |
| `PDF_QUEUE` | `pdf-jobs` | Queue name (also used to derive DLX/DLQ) |
| `PDF_CONCURRENCY` | `2` | In-flight renders per worker |
| `JOB_TTL_MS` | `3600000` | How long job results sit in the in-memory cache (1h) |

## Scripts

```
npm run generate   # run CLI
npm run server     # start HTTP server
npm run worker     # start queue worker
npm start          # alias for server
```

## Layout

```
assets/               # svg icons used in the pdf
example_data/         # sample inputs
src/
  config.js           # env + constants
  middleware/auth.js  # api key check
  pdf/                # rendering (template, components, browser, helpers)
  queue/              # rabbitmq + in-memory job store
  routes/             # /health, /pdf, /jobs
server.js             # http api entry
worker.js             # queue consumer entry
generate.js           # CLI entry
data.json             # default CLI input
```

Deeper architecture notes in [WALKTHROUGH.md](WALKTHROUGH.md).

## Scaling notes

- Run multiple `worker` processes against the same RabbitMQ — jobs spread automatically.
- The HTTP server keeps job results in-memory (keyed by correlation id). A job submitted to server instance A can only be polled from A. For multi-instance deployments use sticky sessions or swap the in-memory map for Redis.
- Puppeteer keeps a single Chromium alive per process; keep `PDF_CONCURRENCY` around 2–4 per worker to avoid memory pressure.
- Failed jobs are dead-lettered to `<queue>.dlq` — inspect via the RabbitMQ management UI.

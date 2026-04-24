// worker that pulls jobs from rabbit, renders the pdf, and replies with the result
import { generatePdf, closeBrowser } from "./src/pdf/index.js";
import { createChannel, close as closeRabbit } from "./src/queue/rabbit.js";
import { QUEUE_NAME, PDF_CONCURRENCY } from "./src/config.js";

const channel = await createChannel();
await channel.prefetch(PDF_CONCURRENCY);

console.log(`worker ready (queue=${QUEUE_NAME}, concurrency=${PDF_CONCURRENCY})`);

channel.consume(QUEUE_NAME, async (msg) => {
  if (!msg) return;

  const { replyTo, correlationId } = msg.properties;

  try {
    const { data } = JSON.parse(msg.content.toString());
    const buf = await generatePdf(data);

    // send result back to server's reply queue
    if (replyTo) {
      channel.sendToQueue(
        replyTo,
        Buffer.from(JSON.stringify({
          ok: true,
          pdfBase64: buf.toString("base64"),
        })),
        { correlationId }
      );
    }

    channel.ack(msg);
    console.log(`job ${correlationId} done (${buf.length} bytes)`);
  } catch (err) {
    console.error(`job ${correlationId} failed:`, err.message);

    // tell the server it failed
    if (replyTo) {
      channel.sendToQueue(
        replyTo,
        Buffer.from(JSON.stringify({ ok: false, error: err.message })),
        { correlationId }
      );
    }

    // send to dead letter queue — don't requeue here to avoid poison messages
    channel.nack(msg, false, false);
  }
});

// shutdown
async function shutdown(signal) {
  console.log(`${signal} received, shutting down...`);
  try {
    await channel.close();
    await closeRabbit();
    await closeBrowser();
  } catch (err) {
    console.error("shutdown error:", err.message);
  }
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

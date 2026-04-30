// in-memory store for async job results
// - worker replies are consumed here and cached until caller polls
// - entries expire after JOB_TTL_MS to keep memory from growing forever
import crypto from "crypto";
import { createRabbitMQChannel } from "./rabbit.js";
import { QUEUE_NAME, JOB_TTL_MS } from "../config.js";

const jobs = new Map();

let channel = null;
let replyQueue = null;
let cleanupInterval = null;

export async function initChannel() {
  channel = await createRabbitMQChannel();

  // exclusive reply queue — each server instance gets its own
  const q = await channel.assertQueue("", {
    exclusive: true,
    autoDelete: true,
  });
  replyQueue = q.queue;

  channel.consume(
    replyQueue,
    (msg) => {
      if (!msg) return;
      const id = msg.properties.correlationId;
      try {
        const result = JSON.parse(msg.content.toString());
        if (result.ok) {
          setJob(id, { status: "completed", pdfBase64: result.pdfBase64 });
        } else {
          setJob(id, { status: "failed", error: result.error });
        }
      } catch (err) {
        console.error("bad reply message:", err.message);
      }
    },
    { noAck: true },
  );

  // cleanup expired jobs every minute
  cleanupInterval = setInterval(cleanup, 60000);
  cleanupInterval.unref();

  console.log("job store ready, reply queue:", replyQueue);
}

export async function closeChannel() {
  if (channel) {
    try {
      await channel.close();
    } catch {}
    channel = null;
  }
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
}

export function submit(data) {
  const id = crypto.randomUUID();
  setJob(id, { status: "queued" });

  channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify({ data })), {
    persistent: true,
    correlationId: id,
    replyTo: replyQueue,
  });

  return id;
}

export function get(id) {
  return jobs.get(id) || null;
}

function setJob(id, patch) {
  const existing = jobs.get(id) || {};
  jobs.set(id, {
    ...existing,
    ...patch,
    expiresAt: Date.now() + JOB_TTL_MS,
  });
}

function cleanup() {
  const now = Date.now();
  for (const [id, job] of jobs) {
    if (job.expiresAt && job.expiresAt < now) {
      jobs.delete(id);
    }
  }
}

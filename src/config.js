// central place for env vars and app-wide constants
export const PORT = Number(process.env.PORT || 3000);
export const API_KEY = process.env.API_KEY || null;

export const RABBIT_URL = process.env.RABBIT_URL || "amqp://localhost:5672";
export const QUEUE_NAME = process.env.PDF_QUEUE || "pdf-jobs";
export const DLX = QUEUE_NAME + ".dlx";
export const DLQ = QUEUE_NAME + ".dlq";

export const PDF_CONCURRENCY = Number(process.env.PDF_CONCURRENCY || 2);
export const JOB_TTL_MS = Number(process.env.JOB_TTL_MS || 3600000); // 1h

// http api entry point
import express from "express";
import { PORT } from "./src/config.js";
import { apiKey } from "./src/middleware/auth.js";
import * as jobStore from "./src/queue/jobStore.js";
import { close as closeRabbit } from "./src/queue/rabbit.js";
import { closeBrowser } from "./src/pdf/index.js";
import healthRoutes from "./src/routes/health.js";
import pdfRoutes from "./src/routes/pdf.js";
import jobRoutes from "./src/routes/jobs.js";

const app = express();
app.use(express.json({ limit: "5mb" }));
app.use(apiKey);

app.use(healthRoutes);
app.use(pdfRoutes);
app.use(jobRoutes);

// start
await jobStore.init();
const server = app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

// graceful shutdown
async function shutdown(signal) {
  console.log(`${signal} received, shutting down...`);
  server.close();
  try {
    await jobStore.close();
    await closeRabbit();
    await closeBrowser();
  } catch (err) {
    console.error("shutdown error:", err.message);
  }
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

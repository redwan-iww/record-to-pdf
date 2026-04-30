// http api entry point
import express from "express";
import { PORT } from "./src/config.js";
import { apiKey } from "./src/middleware/auth.js";
import * as jobStore from "./src/queue/jobStore.js";
import { closeRabbitMQ } from "./src/queue/rabbit.js";
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
await jobStore.initChannel();
const server = app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

// graceful shutdown
function shutdown(signal) {
  console.log(`${signal} received, shutting down...`);

  const serverClose = () =>
    new Promise((resolve) => {
      server.close((err) => {
        if (err) console.error("server.close error:", err.message);
        resolve();
      });
    });

  const closeAll = async () => {
    try {
      await serverClose();
    } catch (err) {
      console.error("server.close error:", err.message);
    }
    try {
      await jobStore.closeChannel();
    } catch (err) {
      console.error("jobStore.closeChannel error:", err.message);
    }
    try {
      await closeRabbitMQ();
    } catch (err) {
      console.error("closeRabbitMQ error:", err.message);
    }
    try {
      await closeBrowser();
    } catch (err) {
      console.error("closeBrowser error:", err.message);
    }
  };

  const forceExit = new Promise((resolve) =>
    setTimeout(() => {
      console.error("shutdown timeout — forcing exit");
      resolve();
    }, 5000),
  );

  Promise.race([closeAll(), forceExit]).then(() => process.exit(0));
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

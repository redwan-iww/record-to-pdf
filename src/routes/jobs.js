// async job endpoints — queue a render and poll for the result
import { Router } from "express";
import * as jobStore from "../queue/jobStore.js";

const router = Router();

router.post("/jobs", (req, res) => {
  try {
    const id = jobStore.submit(req.body);
    res.status(202).json({ id, status: "queued" });
  } catch (err) {
    console.error("enqueue error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/jobs/:id", (req, res) => {
  const job = jobStore.get(req.params.id);
  if (!job) return res.status(404).json({ error: "not found" });

  const response = { id: req.params.id, status: job.status };
  if (job.status === "completed") response.pdf = job.pdfBase64;
  if (job.status === "failed") response.error = job.error;
  res.json(response);
});

// download the pdf bytes directly
router.get("/jobs/:id/pdf", (req, res) => {
  const job = jobStore.get(req.params.id);
  if (!job) return res.status(404).json({ error: "not found" });
  if (job.status !== "completed") {
    return res.status(409).json({ status: job.status });
  }
  const buf = Buffer.from(job.pdfBase64, "base64");
  res.type("application/pdf").send(buf);
});

export default router;

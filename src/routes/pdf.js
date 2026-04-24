// sync pdf endpoint — renders and returns the bytes right away
import { Router } from "express";
import { generatePdf } from "../pdf/index.js";

const router = Router();

router.post("/pdf", async (req, res) => {
  try {
    const buf = await generatePdf(req.body);
    res.type("application/pdf").send(buf);
  } catch (err) {
    console.error("pdf error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

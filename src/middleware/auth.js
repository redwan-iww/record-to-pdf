// simple api key check — skipped if no API_KEY set (handy for local dev)
import { API_KEY } from "../config.js";

export function apiKey(req, res, next) {
  if (!API_KEY) return next();
  if (req.path === "/health") return next();
  if (req.get("x-api-key") !== API_KEY) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
}

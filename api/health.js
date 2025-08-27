// api/health.js — AlkindiX Health Check
// ------------------------------------------------------------
// Simple endpoint to confirm deployment health.
// Useful for uptime monitors, CI/CD checks, or sanity pings.
// ------------------------------------------------------------

export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    project: "AlkindiX",
    ts: new Date().toISOString(),
    region: process.env.VERCEL_REGION || "unknown"
  });
}

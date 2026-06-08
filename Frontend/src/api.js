// Central API base URL config.
// In production (Vercel), uses REACT_APP_API_URL environment variable.
// Locally, falls back to http://localhost:5000
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default API_BASE;

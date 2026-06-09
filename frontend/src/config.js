// Local dev falls back to localhost, production reads VITE_API_URL (set on Render).
export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

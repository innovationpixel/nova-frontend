export const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "";

const normalizedApiBase = API_BASE_URL.replace(/\/+$/, "");
export const API_ROOT_URL = normalizedApiBase
  ? `${normalizedApiBase.replace(/\/api$/i, "")}/`
  : "";

export const IMAGE_BASE_URL =
  process.env.REACT_APP_BACKEND_URL_IMAGE || process.env.BACKEND_URL_IMAGE || "";

if (typeof window !== "undefined" && !API_BASE_URL) {
  // Helps catch missing envs that cause relative API calls in dev.
  console.error(
    "REACT_APP_BACKEND_URL is not set. Update .env and restart the dev server.",
  );
}

const RAW_API_URL = import.meta.env.VITE_API_URL as string | undefined;

if (!RAW_API_URL) {
  // This makes the problem obvious instead of silently calling the SWA origin.
  throw new Error("Missing VITE_API_URL. Set it in Azure Static Web Apps Application settings and redeploy.");
}

const API_URL = RAW_API_URL.replace(/\/+$/, ""); // remove trailing slash

function getToken() {
  return localStorage.getItem("token");
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const res = await fetch(`${API_URL}${cleanPath}`, { ...options, headers });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}


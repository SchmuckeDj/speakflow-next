/**
 * Cliente HTTP para la API de Django.
 * Lee el token JWT desde localStorage y lo adjunta automáticamente.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function getToken(): string | null {
  try { return localStorage.getItem("sf_token"); }
  catch { return null; }
}

export function saveTokens(access: string, refresh: string) {
  localStorage.setItem("sf_token",         access);
  localStorage.setItem("sf_refresh_token", refresh);
}

export async function clearTokens() {
  // Invalidar refresh token en el servidor
  const refresh = localStorage.getItem("sf_refresh_token");
  if (refresh) {
    try {
      await fetch(`${API_URL}/api/auth/logout/`, {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${getToken() ?? ""}`,
        },
        body: JSON.stringify({ refresh }),
      });
    } catch {}
  }
  localStorage.removeItem("sf_token");
  localStorage.removeItem("sf_refresh_token");
  localStorage.removeItem("sf_user");
  document.cookie = "sf_session=; path=/; max-age=0";
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh = localStorage.getItem("sf_refresh_token");
  if (!refresh) return null;
  try {
    const res = await fetch(`${API_URL}/api/auth/refresh/`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ refresh }),
    });
    if (!res.ok) { await clearTokens(); return null; }
    const data = await res.json();
    localStorage.setItem("sf_token", data.access);
    if (data.refresh) localStorage.setItem("sf_refresh_token", data.refresh);
    return data.access;
  } catch {
    return null;
  }
}

interface ApiOptions extends RequestInit {
  auth?: boolean;
}

export async function apiFetch(path: string, options: ApiOptions = {}): Promise<Response> {
  const { auth = true, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string> ?? {}),
  };

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let res = await fetch(`${API_URL}${path}`, { ...fetchOptions, headers });

  // Token expirado → intentar refresh
  if (res.status === 401 && auth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${API_URL}${path}`, { ...fetchOptions, headers });
    } else {
      window.location.href = "/login";
    }
  }

  return res;
}

export { API_URL };

import { useAuth } from "./auth-context";
import envConfig from "./config-env";

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
  getAuth?: () => Promise<{ accessToken: string | null; refreshToken: string | null; user: any; login: Function; logout: Function; }>
) {
  let accessToken = localStorage.getItem("access_token");
  let refreshToken = localStorage.getItem("refresh_token");
  let userStr = localStorage.getItem("user");
  let user = userStr ? JSON.parse(userStr) : null;

  const doFetch = async (token: string | null) => {
    const headers = {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    } as Record<string, string>;
    return fetch(url, { ...options, headers });
  };

  let res = await doFetch(accessToken);
  if (res.status === 401 && refreshToken) {
    // Gọi API refresh
    const refreshRes = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    const data = await refreshRes.json();
    if (refreshRes.ok && data.access_token && data.refresh_token && data.user) {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      accessToken = data.access_token;
      refreshToken = data.refresh_token;
      user = data.user;
      // Retry fetch với access_token mới
      res = await doFetch(accessToken);
    } else {
      // Refresh token cũng hết hạn, logout
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      if (getAuth) {
        const ctx = await getAuth();
        ctx.logout();
      }
    }
  }
  return res;
}

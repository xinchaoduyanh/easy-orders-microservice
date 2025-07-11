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

  console.log("Initial tokens from localStorage:", { accessToken, refreshToken });

  const doFetch = async (token: string | null) => {
    const headers = {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    } as Record<string, string>;
    console.log("Fetching URL:", url, "with headers:", headers);
    return fetch(url, { ...options, headers });
  };

  let res = await doFetch(accessToken);
  console.log("First fetch response status:", res.status);

  // Chỉ gọi refresh token nếu thực sự bị 401
  if (res.status === 401 && refreshToken) {
    console.log("Received 401. Attempting to refresh token...");
    // Gọi API refresh
    const refreshRes = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    console.log("Refresh token API response status:", refreshRes.status);
    const data = await refreshRes.json();
    console.log("Refresh token API response data:", data);

    // Lấy token từ data.data thay vì root
    const tokenData = data.data || {};
    if (
      refreshRes.ok &&
      tokenData.access_token &&
      tokenData.refresh_token &&
      tokenData.user
    ) {
      // Lưu lại token mới
      localStorage.setItem("access_token", tokenData.access_token);
      localStorage.setItem("refresh_token", tokenData.refresh_token);
      localStorage.setItem("user", JSON.stringify(tokenData.user));
      accessToken = tokenData.access_token;
      refreshToken = tokenData.refresh_token;
      user = tokenData.user;
      console.log("Tokens refreshed successfully. New tokens:", { accessToken, refreshToken });
      // Retry lại request với access_token mới
      res = await doFetch(accessToken);
      console.log("Retried fetch response status:", res.status);
    } else {
      // Refresh token cũng hết hạn hoặc lỗi, chỉ lúc này mới clear token và logout
      console.log("Refresh token failed or data is incomplete. Clearing tokens and logging out.");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      if (getAuth) {
        const ctx = await getAuth();
        ctx.logout();
        console.log("Logout function called.");
      }
    }
  } else if (res.status !== 401) {
      console.log("Response is not 401, or no refresh token. Not attempting refresh.");
  } else if (!refreshToken) {
      console.log("Response is 401 but no refresh token available. Not attempting refresh.");
  }
  // Không tự động clear token nếu không phải lỗi refresh
  console.log("Final response being returned.");
  return res;
}
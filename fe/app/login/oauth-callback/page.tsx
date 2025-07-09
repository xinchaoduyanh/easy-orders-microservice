"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OAuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const user = params.get("user");

    if (accessToken && refreshToken && user) {
      let userObj = null;
      try {
        userObj = JSON.parse(decodeURIComponent(user));
        localStorage.setItem("user", JSON.stringify(userObj));
      } catch (e) {
        localStorage.setItem("user", user);
      }
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      router.replace("/dashboard");
    } else {
      alert("Đăng nhập thất bại hoặc thiếu thông tin!");
    }
  }, [router]);

  return <div>Đang xác thực, vui lòng chờ...</div>;
}

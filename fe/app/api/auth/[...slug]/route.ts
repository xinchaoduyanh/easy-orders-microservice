import { NextRequest, NextResponse } from "next/server";
import envConfig from "@/lib/config-env";

export async function GET(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const url = `${envConfig.NEXT_PUBLIC_AUTH_URL}/auth/${params.slug.join("/")}${req.url.includes("?") ? req.url.substring(req.url.indexOf("?")) : ""}`;
  const res = await fetch(url, {
    method: "GET",
    headers: req.headers,
    redirect: "manual",
  });
  // Nếu là redirect, trả về redirect luôn
  if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
    return NextResponse.redirect(res.headers.get("location")!, { status: res.status });
  }
  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") || "application/json" },
  });
}

export async function POST(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const url = `${envConfig.NEXT_PUBLIC_AUTH_URL}/auth/${params.slug.join("/")}`;
  const body = await req.text();
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": req.headers.get("content-type") || "application/json" },
    body,
  });
  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") || "application/json" },
  });
} 
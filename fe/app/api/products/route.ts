import { NextRequest, NextResponse } from "next/server";
import envConfig from "@/lib/config-env";

export async function GET() {
  const res = await fetch(`${envConfig.NEXT_PUBLIC_ORDER_URL}/products`);
  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") || "application/json" },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const res = await fetch(`${envConfig.NEXT_PUBLIC_ORDER_URL}/products`, {
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
import { NextRequest, NextResponse } from "next/server";
import envConfig from "@/lib/config-env";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const res = await fetch(`${envConfig.NEXT_PUBLIC_ORDER_URL}/orders/${params.id}`);
  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") || "application/json" },
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  // For cancel order
  const url = `${envConfig.NEXT_PUBLIC_ORDER_URL}/orders/${params.id}/cancel`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": req.headers.get("content-type") || "application/json" },
    body: await req.text(),
  });
  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") || "application/json" },
  });
} 
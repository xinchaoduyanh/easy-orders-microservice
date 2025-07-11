import { NextRequest, NextResponse } from "next/server";
import envConfig from "@/lib/config-env";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  // Lấy token từ header Authorization của request gốc
  const authHeader = req.headers.get("authorization");
  const res = await fetch(`${envConfig.NEXT_PUBLIC_ORDER_URL}/orders/${params.id}`, {
    headers: {
      ...(authHeader ? { Authorization: authHeader } : {}),
      "content-type": "application/json",
    },
  });
  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") || "application/json" },
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  // For cancel order
  const url = `${envConfig.NEXT_PUBLIC_ORDER_URL}/orders/${params.id}/cancel`;
  const authHeader = req.headers.get("authorization");
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      ...(authHeader ? { Authorization: authHeader } : {}),
      "Content-Type": req.headers.get("content-type") || "application/json",
    },
    body: await req.text(),
  });
  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") || "application/json" },
  });
} 
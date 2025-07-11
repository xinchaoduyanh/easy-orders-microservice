import { NextRequest, NextResponse } from "next/server";
import envConfig from "@/lib/config-env";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const res = await fetch(`${envConfig.NEXT_PUBLIC_ORDER_URL}/orders/me`, {
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
import { NextRequest, NextResponse } from "next/server";
import envConfig from "@/lib/config-env";

export async function GET(req: NextRequest) {
  const accessToken = req.headers.get("authorization");
  const url = `${envConfig.NEXT_PUBLIC_PAYMENTS_URL}/payments/accounts/balance`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      ...(accessToken ? { authorization: accessToken } : {}),
    },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
} 
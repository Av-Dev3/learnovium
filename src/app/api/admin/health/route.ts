import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    status: "ok", 
    message: "Admin API is working",
    timestamp: new Date().toISOString(),
    route: "/api/admin/health"
  });
}

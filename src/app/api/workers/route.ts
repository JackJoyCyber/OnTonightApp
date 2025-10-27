import { NextResponse } from "next/server";
import { workers } from "@/lib/data";

export async function GET() {
  return NextResponse.json(workers);
}

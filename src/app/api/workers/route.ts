import { NextResponse } from "next/server";
import { workers } from "@/src/lib/data";

export async function GET() {
  return NextResponse.json(workers);
}

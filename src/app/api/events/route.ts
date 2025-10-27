import { NextResponse } from "next/server";
import { events } from "@/src/lib/data";

export async function GET() {
  return NextResponse.json(events);
}

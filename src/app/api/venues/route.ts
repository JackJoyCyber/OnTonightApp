import { NextResponse } from "next/server";
import { venues } from "@/src/lib/data";

export async function GET() {
  return NextResponse.json(venues);
}

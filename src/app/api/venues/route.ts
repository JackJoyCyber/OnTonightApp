import { NextResponse } from "next/server";
import { venues } from "@/lib/data";

export async function GET() {
  return NextResponse.json(venues);
}

import { NextResponse } from "next/server"
import { getState } from "../_store"

export async function GET() {
  return NextResponse.json(getState(), { status: 200 })
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const currencies = await prisma.exchangeRate.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(currencies);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch currencies" },
      { status: 500 },
    );
  }
}

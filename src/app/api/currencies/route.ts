import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const querySchema = z.object({
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid startDate format. Expected YYYY-MM-DD.",
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid endDate format. Expected YYYY-MM-DD.",
  }),
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => parseInt(val, 10)),
  limit: z
    .string()
    .optional()
    .default("10")
    .transform((val) => parseInt(val, 10)),
});

async function fetchCurrencies(
  startDate: Date,
  endDate: Date,
  page: number,
  limit: number,
) {
  const offset = (page - 1) * limit;

  const [currencies, total] = await Promise.all([
    prisma.exchangeRate.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: "asc" },
      skip: offset,
      take: limit,
    }),
    prisma.exchangeRate.count({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),
  ]);

  return { currencies, total };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = querySchema.parse(
      Object.fromEntries(searchParams.entries()),
    );

    const { startDate, endDate, page, limit } = params;

    const { currencies, total } = await fetchCurrencies(
      new Date(startDate),
      new Date(endDate),
      page,
      limit,
    );

    return NextResponse.json({
      data: currencies,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error in GET /api/currencies:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Schema walidacji zapytań
const querySchema = z.object({
  startDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid startDate format. Expected YYYY-MM-DD.",
    }),
  endDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid endDate format. Expected YYYY-MM-DD.",
    }),
  currency: z.string().optional(), // Filtracja po kodzie waluty
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

// Funkcja pobierająca dane z bazy
async function fetchCurrencies({
  startDate,
  endDate,
  currency,
  page,
  limit,
}: {
  startDate?: Date;
  endDate?: Date;
  currency?: string;
  page: number;
  limit: number;
}) {
  const offset = (page - 1) * limit;

  const where: any = {}; // Warunki filtrowania

  // Dodanie filtrów do warunku
  if (startDate) where.date = { ...where.date, gte: startDate };
  if (endDate) where.date = { ...where.date, lte: endDate };
  if (currency) where.currency = currency;

  const [currencies, total] = await Promise.all([
    prisma.exchangeRate.findMany({
      where,
      orderBy: { date: "asc" },
      skip: offset,
      take: limit,
    }),
    prisma.exchangeRate.count({ where }),
  ]);

  return { currencies, total };
}

// Główny handler GET
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = querySchema.parse(
      Object.fromEntries(searchParams.entries()),
    );

    const { startDate, endDate, currency, page, limit } = params;

    const { currencies, total } = await fetchCurrencies({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      currency,
      page,
      limit,
    });

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

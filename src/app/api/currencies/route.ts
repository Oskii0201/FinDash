import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { CurrencyData } from "@/types/types";

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
  currency: z.string().optional(),
  grouping: z.enum(["year", "quarter", "month", "day"]).optional(), // Nowy parametr
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

interface WhereCondition {
  date?: {
    gte?: Date;
    lte?: Date;
  };
  currency?: string;
}

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

  const where: WhereCondition = {};

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

  const formattedCurrencies = currencies.map((currency) => ({
    ...currency,
    date: currency.date.toISOString(),
  }));

  return { currencies: formattedCurrencies, total };
}

function groupData(
  data: CurrencyData[],
  type: "year" | "quarter" | "month" | "day",
) {
  if (!data || data.length === 0) return {};

  return data.reduce(
    (acc, item) => {
      const date = new Date(item.date);
      let key;

      switch (type) {
        case "year":
          key = date.getFullYear().toString();
          break;
        case "quarter":
          key = `${date.getFullYear()}-Q${Math.ceil((date.getMonth() + 1) / 3)}`;
          break;
        case "month":
          key = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}`;
          break;
        case "day":
          key = item.date;
          break;
      }

      if (!acc[key]) acc[key] = [];
      acc[key].push(item);

      return acc;
    },
    {} as Record<string, CurrencyData[]>,
  );
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = querySchema.parse(
      Object.fromEntries(searchParams.entries()),
    );

    const { startDate, endDate, currency, page, limit, grouping } = params;

    const { currencies, total } = await fetchCurrencies({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      currency,
      page,
      limit,
    });

    let groupedData: CurrencyData[] | Record<string, CurrencyData[]> =
      currencies;

    if (grouping) {
      groupedData = groupData(currencies, grouping);
    }

    return NextResponse.json({
      data: groupedData,
      total,
      page,
      limit,
      grouped: !!grouping,
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

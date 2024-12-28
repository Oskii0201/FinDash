import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const API_URL = "https://api.nbp.pl/api/exchangerates/tables/A";

interface Rate {
  code: string;
  mid: number;
}

interface ApiResponse {
  rates: Rate[];
  effectiveDate: string;
}

export async function GET() {
  try {
    const response = await fetch(API_URL);
    const data: ApiResponse[] = await response.json();

    const rates = data[0]?.rates.map((rate: Rate) => ({
      currency: rate.code,
      rate: rate.mid,
      date: new Date(data[0].effectiveDate),
    }));

    if (!rates) {
      return NextResponse.json({ error: "Brak danych." }, { status: 400 });
    }

    for (const rate of rates) {
      await prisma.exchangeRate.upsert({
        where: { currency_date: { currency: rate.currency, date: rate.date } },
        update: { rate: rate.rate },
        create: rate,
      });
    }

    return NextResponse.json(rates);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Błąd podczas pobierania danych." },
      { status: 500 },
    );
  }
}

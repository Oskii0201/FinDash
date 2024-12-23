import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const API_URL = "https://api.nbp.pl/api/exchangerates/tables/A";

export async function GET() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    const rates = data[0]?.rates.map((rate: any) => ({
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

    const savedRates = await prisma.exchangeRate.findMany({
      orderBy: { date: "desc" },
    });

    return NextResponse.json(savedRates);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Błąd podczas pobierania danych." },
      { status: 500 },
    );
  }
}

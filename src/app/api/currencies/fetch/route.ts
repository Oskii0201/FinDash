import { NextResponse } from "next/server";
import axios from "axios";
import { saveRatesToDatabase } from "@/utils/saveRatesToDatabase";

export async function POST() {
  try {
    // Pobieranie danych z API
    const response = await axios.get(
      "https://api.nbp.pl/api/exchangerates/tables/A/",
    );
    const rates = response.data[0]?.rates || [];
    const date = response.data[0]?.effectiveDate;

    if (!rates.length || !date) {
      console.error("No data from API or missing effectiveDate.");
      return NextResponse.json({ error: "No data from API" }, { status: 400 });
    }

    console.log(`Fetched ${rates.length} rates for date ${date}.`);

    // Zapis do bazy danych
    await saveRatesToDatabase(rates, date);

    return NextResponse.json({ message: "Currencies fetched and saved" });
  } catch (error) {
    // Rzutowanie błędu na typ Error
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("Error in POST /api/currencies/fetch:", errorMessage);
    return NextResponse.json(
      { error: "Failed to fetch or save data. See server logs for details." },
      { status: 500 },
    );
  }
}

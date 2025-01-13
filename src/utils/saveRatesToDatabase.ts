import prisma from "@/lib/prisma";

export const saveRatesToDatabase = async (
  rates: { code: string; mid: number }[],
  date: string,
) => {
  try {
    const promises = rates.map((rate) => {
      if (!rate.code || typeof rate.mid !== "number") {
        console.error("Invalid rate data:", rate);
        return Promise.resolve();
      }

      return prisma.exchangeRate.upsert({
        where: { currency_date: { currency: rate.code, date: new Date(date) } },
        update: { rate: rate.mid },
        create: {
          currency: rate.code,
          rate: rate.mid,
          date: new Date(date),
        },
      });
    });

    await Promise.all(promises);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error saving data to database:", errorMessage);
    throw new Error("Failed to save data to database.");
  }
};

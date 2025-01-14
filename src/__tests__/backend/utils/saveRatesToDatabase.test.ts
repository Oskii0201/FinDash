import { saveRatesToDatabase } from "@/utils/saveRatesToDatabase";
import prisma from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    exchangeRate: {
      upsert: jest.fn(),
    },
  },
}));

describe("saveRatesToDatabase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should save valid rates to the database", async () => {
    (prisma.exchangeRate.upsert as jest.Mock).mockResolvedValue({});

    const rates = [
      { code: "USD", mid: 4.5 },
      { code: "EUR", mid: 4.2 },
    ];

    await saveRatesToDatabase(rates, "2025-01-10");

    expect(prisma.exchangeRate.upsert).toHaveBeenCalledTimes(2);
    expect(prisma.exchangeRate.upsert).toHaveBeenCalledWith({
      where: {
        currency_date: { currency: "USD", date: new Date("2025-01-10") },
      },
      update: { rate: 4.5 },
      create: {
        currency: "USD",
        rate: 4.5,
        date: new Date("2025-01-10"),
      },
    });
  });

  it("should skip invalid rates", async () => {
    console.error = jest.fn();

    const rates = [
      { code: "USD", mid: 4.5 },
      { code: "EUR", mid: 4.2 },
      { code: null, mid: null },
    ];

    await saveRatesToDatabase(rates as any, "2025-01-10");

    expect(prisma.exchangeRate.upsert).toHaveBeenCalledTimes(2);
    expect(console.error).toHaveBeenCalledWith("Invalid rate data:", {
      code: null,
      mid: null,
    });
  });

  it("should throw an error if database operation fails", async () => {
    (prisma.exchangeRate.upsert as jest.Mock).mockRejectedValueOnce(
      new Error("Database error"),
    );

    const rates = [{ code: "USD", mid: 4.5 }];

    await expect(saveRatesToDatabase(rates, "2025-01-10")).rejects.toThrow(
      "Failed to save data to database.",
    );

    expect(prisma.exchangeRate.upsert).toHaveBeenCalledTimes(1);
  });
});

import { expect, jest } from "@jest/globals";
import { POST } from "@/app/api/currencies/fetch/route";
import axios from "axios";
import { saveRatesToDatabase } from "@/utils/saveRatesToDatabase";
import { NextResponse } from "next/server";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("@/utils/saveRatesToDatabase");
const mockedSaveRatesToDatabase = saveRatesToDatabase as jest.MockedFunction<
  typeof saveRatesToDatabase
>;

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data: any, init?: { status?: number }) => ({
      json: data,
      status: init?.status || 200,
    })),
  },
}));

describe("POST /api/currencies/fetch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch rates and save them to the database", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        {
          rates: [
            { code: "USD", mid: 4.5 },
            { code: "EUR", mid: 4.2 },
          ],
          effectiveDate: "2025-01-10",
        },
      ],
    });

    mockedSaveRatesToDatabase.mockResolvedValueOnce(undefined);

    await POST();

    expect(NextResponse.json).toHaveBeenCalledWith({
      message: "Currencies fetched and saved",
    });
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "https://api.nbp.pl/api/exchangerates/tables/A/",
    );
    expect(mockedSaveRatesToDatabase).toHaveBeenCalledWith(
      [
        { code: "USD", mid: 4.5 },
        { code: "EUR", mid: 4.2 },
      ],
      "2025-01-10",
    );
  });

  it("should return 400 if API returns no data", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [],
    });

    await POST();

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "No data from API" },
      { status: 400 },
    );
    expect(mockedSaveRatesToDatabase).not.toHaveBeenCalled();
  });

  it("should return 500 if saveRatesToDatabase fails", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        {
          rates: [
            { code: "USD", mid: 4.5 },
            { code: "EUR", mid: 4.2 },
          ],
          effectiveDate: "2025-01-10",
        },
      ],
    });

    mockedSaveRatesToDatabase.mockRejectedValueOnce(
      new Error("Failed to save data to database."),
    );

    await POST();

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Failed to fetch or save data. See server logs for details." },
      { status: 500 },
    );
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedSaveRatesToDatabase).toHaveBeenCalledTimes(1);
  });
});

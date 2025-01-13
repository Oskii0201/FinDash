import { POST } from "@/app/api/currencies/fetch/route";
import { NextResponse } from "next/server";
import axios from "axios";
import { saveRatesToDatabase } from "@/utils/saveRatesToDatabase";

jest.mock("axios");
jest.mock("@/utils/saveRatesToDatabase");

const mockAxios = axios as jest.Mocked<typeof axios>;
const mockSaveRatesToDatabase = saveRatesToDatabase as jest.Mock;

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));
const mockNextResponseJson = NextResponse.json as jest.Mock;
describe("POST /api/currencies/fetch", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch rates and save them to the database", async () => {
    const mockData = {
      data: [
        {
          effectiveDate: "2025-01-01",
          rates: [{ currency: "USD", code: "USD", mid: 3.75 }],
        },
      ],
    };
    mockAxios.get.mockResolvedValue(mockData);

    mockSaveRatesToDatabase.mockResolvedValue(undefined);

    await POST();

    expect(mockAxios.get).toHaveBeenCalledWith(
      "https://api.nbp.pl/api/exchangerates/tables/A/",
    );

    expect(mockSaveRatesToDatabase).toHaveBeenCalledWith(
      mockData.data[0].rates,
      mockData.data[0].effectiveDate,
    );

    expect(mockNextResponseJson).toHaveBeenCalledWith({
      message: "Currencies fetched and saved",
    });
  });

  it("should return 400 if rates or date are missing", async () => {
    const mockData = { data: [{}] };
    mockAxios.get.mockResolvedValue(mockData);

    await POST();

    expect(mockAxios.get).toHaveBeenCalledWith(
      "https://api.nbp.pl/api/exchangerates/tables/A/",
    );

    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { error: "No data from API" },
      { status: 400 },
    );
  });

  it("should return 500 on axios error", async () => {
    mockAxios.get.mockRejectedValue(new Error("Network error"));

    await POST();

    expect(mockAxios.get).toHaveBeenCalledWith(
      "https://api.nbp.pl/api/exchangerates/tables/A/",
    );

    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { error: "Failed to fetch or save data. See server logs for details." },
      { status: 500 },
    );
  });

  it("should return 500 on saveRatesToDatabase error", async () => {
    const mockData = {
      data: [
        {
          effectiveDate: "2025-01-01",
          rates: [{ currency: "USD", code: "USD", mid: 3.75 }],
        },
      ],
    };
    mockAxios.get.mockResolvedValue(mockData);

    mockSaveRatesToDatabase.mockRejectedValue(
      new Error("Database connection error"),
    );

    await POST();

    expect(mockAxios.get).toHaveBeenCalledWith(
      "https://api.nbp.pl/api/exchangerates/tables/A/",
    );
    expect(mockSaveRatesToDatabase).toHaveBeenCalledWith(
      mockData.data[0].rates,
      mockData.data[0].effectiveDate,
    );

    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { error: "Failed to fetch or save data. See server logs for details." },
      { status: 500 },
    );
  });
});

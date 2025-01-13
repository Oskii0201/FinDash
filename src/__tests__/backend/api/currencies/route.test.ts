import { GET } from "@/app/api/currencies/route";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  exchangeRate: {
    findMany: jest.fn(),
    count: jest.fn(),
  },
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

const mockNextResponseJson = NextResponse.json as jest.Mock;
const mockPrismaFindMany = prisma.exchangeRate.findMany as jest.Mock;
const mockPrismaCount = prisma.exchangeRate.count as jest.Mock;
describe("GET /api/currencies", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return currencies and total count on valid query parameters", async () => {
    const mockCurrencies = [
      { id: 1, date: "2025-01-01", currency: "USD", rate: 3.75 },
      { id: 2, date: "2025-01-02", currency: "EUR", rate: 4.2 },
    ];
    const mockTotal = 2;

    mockPrismaFindMany.mockResolvedValue(mockCurrencies);
    mockPrismaCount.mockResolvedValue(mockTotal);

    const req = {
      url: "http://localhost:3000/api/currencies?startDate=2025-01-01&endDate=2025-01-02&page=1&limit=10",
    } as NextRequest;

    await GET(req);

    expect(mockPrismaFindMany).toHaveBeenCalledWith({
      where: {
        date: {
          gte: new Date("2025-01-01"),
          lte: new Date("2025-01-02"),
        },
      },
      orderBy: { date: "asc" },
      skip: 0,
      take: 10,
    });

    expect(mockPrismaCount).toHaveBeenCalledWith({
      where: {
        date: {
          gte: new Date("2025-01-01"),
          lte: new Date("2025-01-02"),
        },
      },
    });

    expect(mockNextResponseJson).toHaveBeenCalledWith({
      data: mockCurrencies,
      total: mockTotal,
      page: 1,
      limit: 10,
    });
  });

  it("should return 400 if query parameters are invalid", async () => {
    const req = {
      url: "http://localhost:3000/api/currencies?startDate=invalid&endDate=2025-01-02",
    } as NextRequest;

    await GET(req);

    expect(mockNextResponseJson).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "Invalid query parameters",
        details: expect.any(Array),
      }),
      { status: 400 },
    );
  });

  it("should return 500 if prisma.findMany throws an error", async () => {
    mockPrismaFindMany.mockRejectedValue(new Error("Database error"));

    const req = {
      url: "http://localhost:3000/api/currencies?startDate=2025-01-01&endDate=2025-01-02&page=1&limit=10",
    } as NextRequest;

    await GET(req);

    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { error: "Internal server error" },
      { status: 500 },
    );
  });

  it("should handle optional query parameters and use defaults", async () => {
    const mockCurrencies = [
      { id: 1, date: "2025-01-01", currency: "USD", rate: 3.75 },
    ];
    const mockTotal = 1;

    mockPrismaFindMany.mockResolvedValue(mockCurrencies);
    mockPrismaCount.mockResolvedValue(mockTotal);

    const req = {
      url: "http://localhost:3000/api/currencies?startDate=2025-01-01&endDate=2025-01-02",
    } as NextRequest;

    await GET(req);

    expect(mockPrismaFindMany).toHaveBeenCalledWith({
      where: {
        date: {
          gte: new Date("2025-01-01"),
          lte: new Date("2025-01-02"),
        },
      },
      orderBy: { date: "asc" },
      skip: 0,
      take: 10,
    });

    expect(mockNextResponseJson).toHaveBeenCalledWith({
      data: mockCurrencies,
      total: mockTotal,
      page: 1,
      limit: 10,
    });
  });
});

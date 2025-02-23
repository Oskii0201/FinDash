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

  it("should return filtered currencies and total count", async () => {
    const mockCurrencies = [
      { id: 1, date: "2025-01-01T00:00:00.000Z", currency: "USD", rate: 3.75 },
      { id: 2, date: "2025-01-02T00:00:00.000Z", currency: "EUR", rate: 4.2 },
    ];
    const mockTotal = 2;

    mockPrismaFindMany.mockResolvedValue([
      { id: 1, date: new Date("2025-01-01"), currency: "USD", rate: 3.75 },
      { id: 2, date: new Date("2025-01-02"), currency: "EUR", rate: 4.2 },
    ]);
    mockPrismaCount.mockResolvedValue(mockTotal);

    const req = new Request(
      "http://localhost:3000/api/currencies?startDate=2025-01-01&endDate=2025-01-02&page=1&limit=10",
    ) as NextRequest;

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
      grouped: false,
    });
  });

  it("should return grouped currencies when grouping is specified", async () => {
    const groupedData = {
      "2025-01": [
        {
          id: 1,
          date: "2025-01-01T00:00:00.000Z",
          currency: "USD",
          rate: 3.75,
        },
        { id: 2, date: "2025-01-02T00:00:00.000Z", currency: "EUR", rate: 4.2 },
      ],
    };
    const mockTotal = 2;

    mockPrismaFindMany.mockResolvedValue([
      { id: 1, date: new Date("2025-01-01"), currency: "USD", rate: 3.75 },
      { id: 2, date: new Date("2025-01-02"), currency: "EUR", rate: 4.2 },
    ]);
    mockPrismaCount.mockResolvedValue(mockTotal);

    const req = new Request(
      "http://localhost:3000/api/currencies?startDate=2025-01-01&endDate=2025-01-02&grouping=month",
    ) as NextRequest;

    await GET(req);

    expect(mockNextResponseJson).toHaveBeenCalledWith({
      data: groupedData,
      total: mockTotal,
      page: 1,
      limit: 10,
      grouped: true,
    });
  });

  it("should return 400 for invalid query parameters", async () => {
    const req = new Request(
      "http://localhost:3000/api/currencies?startDate=invalid&endDate=2025-01-02",
    ) as NextRequest;

    await GET(req);

    expect(mockNextResponseJson).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "Invalid query parameters",
        details: expect.any(Array),
      }),
      { status: 400 },
    );
  });

  it("should return all currencies if no filters are provided", async () => {
    const mockCurrencies = [
      { id: 1, date: "2025-01-01T00:00:00.000Z", currency: "USD", rate: 3.75 },
      { id: 2, date: "2025-01-02T00:00:00.000Z", currency: "EUR", rate: 4.2 },
    ];
    const mockTotal = 2;

    mockPrismaFindMany.mockResolvedValue([
      { id: 1, date: new Date("2025-01-01"), currency: "USD", rate: 3.75 },
      { id: 2, date: new Date("2025-01-02"), currency: "EUR", rate: 4.2 },
    ]);
    mockPrismaCount.mockResolvedValue(mockTotal);

    const req = new Request(
      "http://localhost:3000/api/currencies",
    ) as NextRequest;

    await GET(req);

    expect(mockPrismaFindMany).toHaveBeenCalledWith({
      where: {},
      orderBy: { date: "asc" },
      skip: 0,
      take: 10,
    });

    expect(mockNextResponseJson).toHaveBeenCalledWith({
      data: mockCurrencies,
      total: mockTotal,
      page: 1,
      limit: 10,
      grouped: false,
    });
  });

  it("should return 500 if database query fails", async () => {
    mockPrismaFindMany.mockRejectedValue(new Error("Database error"));

    const req = new Request(
      "http://localhost:3000/api/currencies?startDate=2025-01-01&endDate=2025-01-02",
    ) as NextRequest;

    await GET(req);

    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { error: "Internal server error" },
      { status: 500 },
    );
  });
});

import fetchCurrencies from "@/utils/fetchCurrencies";

global.fetch = jest.fn();

describe("fetchCurrencies", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch currencies with correct query parameters", async () => {
    const mockResponse = {
      data: [
        { id: 1, date: "2025-01-01", currency: "USD", rate: 3.75 },
        { id: 2, date: "2025-01-02", currency: "EUR", rate: 4.2 },
      ],
      total: 2,
      page: 1,
      limit: 10,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const params = {
      startDate: "2025-01-01",
      endDate: "2025-01-31",
      page: 1,
      limit: 10,
      sortColumn: "date",
      sortOrder: "asc" as const,
    };

    const result = await fetchCurrencies(params);

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/currencies?startDate=2025-01-01&endDate=2025-01-31&page=1&limit=10&sortColumn=date&sortOrder=asc",
    );
  });

  it("should throw an error when the response is not ok", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Failed to fetch currencies." }),
    });

    await expect(fetchCurrencies({ startDate: "2025-01-01" })).rejects.toThrow(
      "Failed to fetch currencies.",
    );
  });

  it("should return a default error message when the response has no error", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    await expect(fetchCurrencies({ startDate: "2025-01-01" })).rejects.toThrow(
      "Failed to fetch currencies.",
    );
  });

  it("should handle unexpected errors and return a fallback message", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network error"),
    );

    await expect(fetchCurrencies()).rejects.toThrow("Network error");
  });

  it("should fetch currencies without optional parameters", async () => {
    const mockResponse = {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchCurrencies();

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith("/api/currencies?");
  });
});

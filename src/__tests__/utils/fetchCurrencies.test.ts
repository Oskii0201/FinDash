import fetchCurrencies from "@/utils/fetchCurrencies";

global.fetch = jest.fn();

describe("fetchCurrencies", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a success message when the fetch is successful", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Currencies fetched successfully!" }),
    });

    const result = await fetchCurrencies();

    expect(result).toBe("Currencies fetched successfully!");
    expect(global.fetch).toHaveBeenCalledWith("/api/currencies/fetch", {
      method: "POST",
    });
  });

  it("should throw an error when the response is not ok", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Failed to fetch currencies." }),
    });

    const result = await fetchCurrencies();

    expect(result).toBe("Failed to fetch currencies.");
    expect(global.fetch).toHaveBeenCalledWith("/api/currencies/fetch", {
      method: "POST",
    });
  });

  it("should return a default error message when the response has no error", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    const result = await fetchCurrencies();

    expect(result).toBe("Failed to fetch currencies.");
    expect(global.fetch).toHaveBeenCalledWith("/api/currencies/fetch", {
      method: "POST",
    });
  });

  it("should handle unexpected errors and return a fallback message", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network error"),
    );

    const result = await fetchCurrencies();

    expect(result).toBe("Network error");
    expect(global.fetch).toHaveBeenCalledWith("/api/currencies/fetch", {
      method: "POST",
    });
  });
});

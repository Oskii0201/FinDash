import updateCurrencies from "@/utils/updateCurrencies";

global.fetch = jest.fn();

describe("updateCurrencies", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns success message when API call is successful", async () => {
    // Mock pozytywnej odpowiedzi
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest
        .fn()
        .mockResolvedValue({ message: "Currencies updated successfully!" }),
    });

    const result = await updateCurrencies();
    expect(result).toBe("Currencies updated successfully!");
    expect(fetch).toHaveBeenCalledWith("/api/currencies/fetch", {
      method: "POST",
    });
  });

  it("returns error message when API call fails", async () => {
    // Mock odpowiedzi z błędem API
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest
        .fn()
        .mockResolvedValue({ error: "Failed to update currencies." }),
    });

    const result = await updateCurrencies();
    expect(result).toBe("Failed to update currencies.");
    expect(fetch).toHaveBeenCalledWith("/api/currencies/fetch", {
      method: "POST",
    });
  });

  it("returns fallback error message for unexpected errors", async () => {
    // Mock rzucania wyjątku przez fetch
    (fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    const result = await updateCurrencies();
    expect(result).toBe("Network error");
    expect(fetch).toHaveBeenCalledWith("/api/currencies/fetch", {
      method: "POST",
    });
  });

  it("handles unexpected response formats gracefully", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue(null),
    });

    const result = await updateCurrencies();
    expect(result).toBe("Failed to update currencies.");
  });
});

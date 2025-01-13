const fetchCurrencies = async (): Promise<string> => {
  try {
    const response = await fetch("/api/currencies/fetch", { method: "POST" });
    const data = await response.json();

    if (response.ok) {
      return data.message || "Currencies fetched successfully!";
    } else {
      throw new Error(data.error || "Failed to fetch currencies.");
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return errorMessage;
  }
};

export default fetchCurrencies;

const updateCurrencies = async (): Promise<string> => {
  try {
    const response = await fetch("/api/currencies/fetch", { method: "POST" });

    const data = await response.json();

    if (!response.ok || !data) {
      throw new Error(data?.error || "Failed to update currencies.");
    }

    return data.message || "Currencies updated successfully!";
  } catch (error) {
    console.error("Error in updateCurrencies:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return errorMessage;
  }
};

export default updateCurrencies;

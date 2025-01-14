interface FetchCurrenciesParams {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortColumn?: string;
  sortOrder?: "asc" | "desc" | undefined;
}

interface FetchCurrenciesResponse {
  data: Array<{
    id: number;
    currency: string;
    rate: number;
    date: string;
  }>;
  total: number;
  page: number;
  limit: number;
}

const fetchCurrencies = async (
  params: FetchCurrenciesParams = {},
): Promise<FetchCurrenciesResponse> => {
  try {
    const queryParams = new URLSearchParams();

    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.sortColumn) queryParams.append("sortColumn", params.sortColumn);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const response = await fetch(`/api/currencies?${queryParams.toString()}`);
    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error || "Failed to fetch currencies.");
    }
  } catch (error) {
    console.error("Error in fetchCurrencies:", error);
    throw error;
  }
};

export default fetchCurrencies;

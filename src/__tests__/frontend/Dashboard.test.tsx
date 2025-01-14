import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import fetchCurrencies from "@/utils/fetchCurrencies";
import Dashboard from "@/app/dashboard/(overwiew)/page";
import { act } from "react";

jest.mock("@/utils/fetchCurrencies");
jest.mock("@/utils/updateCurrencies");

describe("Dashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the dashboard with table, date picker, and button", () => {
    render(<Dashboard />);

    expect(screen.getByText("Currency Rates Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Fetch Currencies")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Select start date"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Select end date")).toBeInTheDocument();
  });

  it("fetches and displays data in the table", async () => {
    const mockData = {
      data: [
        { id: 1, date: "2025-01-01", currency: "USD", rate: 3.75 },
        { id: 2, date: "2025-01-02", currency: "EUR", rate: 4.2 },
      ],
      total: 2,
    };
    (fetchCurrencies as jest.Mock).mockResolvedValueOnce(mockData);

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("2025-01-01")).toBeInTheDocument();
      expect(screen.getByText("USD")).toBeInTheDocument();
      expect(screen.getByText("3.75")).toBeInTheDocument();
    });

    expect(fetchCurrencies).toHaveBeenCalledWith({
      startDate: undefined,
      endDate: undefined,
      page: 1,
      limit: 10,
    });
  });

  it("updates data when date range is changed", async () => {
    const mockData = {
      data: [{ id: 1, date: "2025-01-05", currency: "GBP", rate: 4.0 }],
      total: 1,
    };
    (fetchCurrencies as jest.Mock).mockResolvedValueOnce(mockData);

    render(<Dashboard />);

    const startDateInput = screen.getByPlaceholderText("Select start date");
    fireEvent.change(startDateInput, { target: { value: "2025-01-05" } });

    await waitFor(() => {
      expect(fetchCurrencies).toHaveBeenCalledWith({
        startDate: "2025-01-05",
        endDate: undefined,
        page: 1,
        limit: 10,
      });
    });
  });

  it("handles pagination correctly", async () => {
    const mockData = {
      data: [{ id: 1, date: "2025-01-01", currency: "USD", rate: 3.75 }],
      total: 20,
    };
    (fetchCurrencies as jest.Mock).mockResolvedValue(mockData);

    await act(async () => {
      render(<Dashboard />);
    });

    const nextPageButton = screen.getByRole("button", { name: /Next Page/i });
    fireEvent.click(nextPageButton);

    await waitFor(() => {
      expect(fetchCurrencies).toHaveBeenCalledWith({
        startDate: undefined,
        endDate: undefined,
        page: 2,
        limit: 10,
      });
    });
  });
});

import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import fetchCurrencies from "@/utils/fetchCurrencies";
import updateCurrencies from "@/utils/updateCurrencies";
import Dashboard from "@/app/dashboard/(overwiew)/page";
import { act } from "react";

jest.mock("@/utils/fetchCurrencies");
jest.mock("@/utils/updateCurrencies");

describe("Dashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the dashboard with table, date picker, grouping select, and button", () => {
    render(<Dashboard />);

    expect(screen.getByText("Currency Rates Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Fetch Currencies")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Select start date"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Select end date")).toBeInTheDocument();
    expect(screen.getByLabelText("Group by:")).toBeInTheDocument();
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
      grouping: undefined,
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
    const endDateInput = screen.getByPlaceholderText("Select end date");

    fireEvent.change(startDateInput, { target: { value: "2025-01-01" } });
    fireEvent.change(endDateInput, { target: { value: "2025-01-05" } });

    await waitFor(() => {
      expect(fetchCurrencies).toHaveBeenCalledWith({
        startDate: "2025-01-01",
        endDate: "2025-01-05",
        grouping: undefined,
        page: 1,
        limit: 10,
      });
    });
  });

  it("fetches grouped data when grouping option is selected", async () => {
    const mockGroupedData = {
      data: {
        "2025": [{ id: 1, date: "2025-01-01", currency: "USD", rate: 3.75 }],
        "2024": [{ id: 2, date: "2024-12-31", currency: "EUR", rate: 4.2 }],
      },
      total: 2,
    };
    (fetchCurrencies as jest.Mock).mockResolvedValueOnce(mockGroupedData);

    render(<Dashboard />);

    const groupingSelect = screen.getByLabelText("Group by:");
    fireEvent.change(groupingSelect, { target: { value: "year" } });

    await waitFor(() => {
      expect(fetchCurrencies).toHaveBeenCalledWith({
        startDate: undefined,
        endDate: undefined,
        grouping: "year",
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
        grouping: undefined,
        page: 2,
        limit: 10,
      });
    });
  });

  it("triggers update currencies on button click", async () => {
    (updateCurrencies as jest.Mock).mockResolvedValueOnce("Currencies updated");

    await act(async () => {
      render(<Dashboard />);
    });

    const updateButton = screen.getByText("Fetch Currencies");
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(updateCurrencies).toHaveBeenCalledTimes(1);
    });
  });
});

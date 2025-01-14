import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import CurrencyTable from "@/components/CurrencyTable";
import { CurrencyData } from "@/types/types";

const mockData: CurrencyData[] = [
  { id: 1, date: "2025-01-01", currency: "USD", rate: 3.75 },
  { id: 2, date: "2025-01-02", currency: "EUR", rate: 4.2 },
];

const mockColumns = [
  { name: "Date", selector: (row: CurrencyData) => row.date, sortable: true },
  {
    name: "Currency",
    selector: (row: CurrencyData) => row.currency,
    sortable: true,
  },
  {
    name: "Rate",
    selector: (row: CurrencyData) => row.rate.toFixed(2),
    sortable: true,
  },
];

describe("CurrencyTable", () => {
  const mockOnPageChange = jest.fn();
  const mockOnRowsPerPageChange = jest.fn();

  const setup = (isLoading = false, data = mockData) =>
    render(
      <CurrencyTable
        data={data}
        columns={mockColumns}
        totalRecords={20}
        currentPage={1}
        rowsPerPage={10}
        isLoading={isLoading}
        onPageChange={mockOnPageChange}
        onRowsPerPageChange={mockOnRowsPerPageChange}
      />,
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders table with data", () => {
    setup();

    expect(screen.getByText("2025-01-01")).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();
    expect(screen.getByText("3.75")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    const { container } = setup(true);

    const loadingIndicator = container.querySelector(".animate-spin");
    expect(loadingIndicator).toBeInTheDocument();
  });

  it("handles pagination", () => {
    setup();

    const nextPageButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextPageButton);

    const [[calledPage]] = mockOnPageChange.mock.calls;
    expect(calledPage).toBe(2);
  });

  it("handles rows per page change", () => {
    setup();

    const rowsPerPageSelect = screen.getByRole("combobox");
    fireEvent.change(rowsPerPageSelect, { target: { value: "20" } });

    const [[rowsPerPage]] = mockOnRowsPerPageChange.mock.calls;
    expect(rowsPerPage).toBe(20);
  });

  it("handles empty data", () => {
    setup(false, []);

    expect(
      screen.getByText(/There are no records to display/i),
    ).toBeInTheDocument();
  });
});

import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import DateRangePicker from "@/components/DateRangePicker";

describe("DateRangePicker", () => {
  const mockOnDateChange = jest.fn();

  const setup = (props = {}) =>
    render(
      <DateRangePicker
        startDate={new Date("2025-01-01")}
        endDate={new Date("2025-01-31")}
        onDateChange={mockOnDateChange}
        {...props}
      />,
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default labels and dates", () => {
    setup();

    expect(screen.getByLabelText("Start Date")).toBeInTheDocument();
    expect(screen.getByLabelText("End Date")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Select start date")).toHaveValue(
      "2025/01/01",
    );
    expect(screen.getByPlaceholderText("Select end date")).toHaveValue(
      "2025/01/31",
    );
  });

  it("calls onDateChange with correct values when dates are changed", () => {
    setup();

    const startInput = screen.getByLabelText("Start Date");
    fireEvent.change(startInput, { target: { value: "01/05/2025" } });

    expect(mockOnDateChange).toHaveBeenCalledWith(
      new Date("2025-01-05"),
      new Date("2025-01-31"),
    );

    const endInput = screen.getByLabelText("End Date");
    fireEvent.change(endInput, { target: { value: "01/10/2025" } });

    expect(mockOnDateChange).toHaveBeenCalledWith(
      new Date("2025-01-05"),
      new Date("2025-01-10"),
    );
  });

  it("updates dates when props change", () => {
    const { rerender } = setup();

    rerender(
      <DateRangePicker
        startDate={new Date("2025-02-01")}
        endDate={new Date("2025-02-28")}
        onDateChange={mockOnDateChange}
      />,
    );

    expect(screen.getByPlaceholderText("Select start date")).toHaveValue(
      "2025/02/01",
    );
    expect(screen.getByPlaceholderText("Select end date")).toHaveValue(
      "2025/02/28",
    );
  });
});

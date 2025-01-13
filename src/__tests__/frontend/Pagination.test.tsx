import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "../../components/Pagination";

describe("Pagination Component", () => {
  const onPageChange = jest.fn();
  const onPageSizeChange = jest.fn();

  const setup = (props = {}) => {
    const defaultProps = {
      currentPage: 1,
      totalPages: 5,
      pageSize: 10,
      pageSizeOptions: [10, 20, 50],
      onPageChange,
      onPageSizeChange,
      ...props,
    };
    return render(<Pagination {...defaultProps} />);
  };
  const getPreviousButton = () =>
    screen.getByRole("button", { name: /previous page/i });
  const getNextButton = () =>
    screen.getByRole("button", { name: /next page/i });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    setup();

    expect(screen.getByText("1 / 5")).toBeInTheDocument();
    expect(screen.getByLabelText("Records:")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("disables 'Previous' button on the first page", () => {
    setup({ currentPage: 1 });
    const previousButton = getPreviousButton();
    expect(previousButton).toHaveProperty("disabled", true);
  });

  it("disables 'Next' button on the last page", () => {
    setup({ currentPage: 5 });

    const nextButton = getNextButton();
    expect(nextButton).toHaveProperty("disabled", true);
  });

  it("calls onPageChange when navigating to the next page", () => {
    setup({ currentPage: 1 });

    const nextButton = getNextButton();
    fireEvent.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange when navigating to the previous page", () => {
    setup({ currentPage: 2 });

    const previousButton = getPreviousButton();
    fireEvent.click(previousButton);

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("calls onPageSizeChange when changing the page size", () => {
    setup();

    const select = screen.getByLabelText("Records:");
    fireEvent.change(select, { target: { value: "20" } });

    expect(onPageSizeChange).toHaveBeenCalledWith(20);
  });

  it("does not call onPageChange when clicking 'Next' on the last page", () => {
    setup({ currentPage: 5 });

    const nextButton = getNextButton();
    fireEvent.click(nextButton);

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("does not call onPageChange when clicking 'Previous' on the first page", () => {
    setup({ currentPage: 1 });

    const previousButton = getPreviousButton();
    fireEvent.click(previousButton);

    expect(onPageChange).not.toHaveBeenCalled();
  });
});

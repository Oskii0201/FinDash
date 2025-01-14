"use client";

import React, { useEffect, useState, useCallback } from "react";
import CurrencyTable from "@/components/CurrencyTable";
import DateRangePicker from "@/components/DateRangePicker";
import { Button } from "@/components/Button";
import updateCurrencies from "@/utils/updateCurrencies";
import fetchCurrencies, {
  FetchCurrenciesResponse,
} from "@/utils/fetchCurrencies";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { CurrencyData } from "@/types/types";

const columns = [
  {
    name: "Date",
    selector: (row: CurrencyData) => format(new Date(row.date), "yyyy-MM-dd"),
    sortable: true,
  },
  {
    name: "Currency",
    selector: (row: CurrencyData) => row.currency,
    sortable: true,
  },
  {
    name: "Rate",
    selector: (row: CurrencyData) => row.rate.toFixed(2),
    sortable: true,
    cell: (row: CurrencyData) => (
      <div style={{ textAlign: "right" }}>{row.rate.toFixed(2)}</div>
    ),
  },
];

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  const [data, setData] = useState<CurrencyData[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: FetchCurrenciesResponse = await fetchCurrencies({
        startDate: dateRange.start
          ? format(dateRange.start, "yyyy-MM-dd")
          : undefined,
        endDate: dateRange.end
          ? format(dateRange.end, "yyyy-MM-dd")
          : undefined,
        page: currentPage,
        limit: rowsPerPage,
      });
      setData(response.data);
      setTotalRecords(response.total);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching currencies:", error.message);
      } else {
        console.error("Error fetching currencies:", String(error));
      }
      toast.error("Failed to fetch data.");
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, currentPage, rowsPerPage]);

  const handleUpdateData = async () => {
    try {
      const message = await updateCurrencies();
      toast.success(message);
      await handleFetchData();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error updating currencies:", error.message);
      } else {
        console.error("Error updating currencies:", String(error));
      }
      toast.error("Failed to update currencies.");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setDateRange({ start, end });
    setCurrentPage(1);
  };

  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);

  return (
    <div className="container mx-auto flex-col gap-4">
      <h1 className="mb-4 text-2xl font-bold">Currency Rates Dashboard</h1>
      <div className="mb-4 flex flex-col items-start justify-start gap-4 md:flex-row md:items-center md:justify-between">
        <DateRangePicker
          startDate={dateRange.start}
          endDate={dateRange.end}
          onDateChange={handleDateChange}
        />
        <Button
          width="w-fit"
          color="blue"
          additionalClasses="h-fit"
          onClick={handleUpdateData}
        >
          Fetch Currencies
        </Button>
      </div>

      <CurrencyTable
        data={data}
        columns={columns}
        totalRecords={totalRecords}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </div>
  );
}

import React from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { CurrencyData } from "@/types/types";
import Loading from "@/app/dashboard/loading";

interface CurrencyTableProps {
  data: CurrencyData[];
  columns: TableColumn<CurrencyData>[];
  totalRecords: number;
  currentPage: number;
  rowsPerPage: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

const CurrencyTable: React.FC<CurrencyTableProps> = ({
  data,
  columns,
  totalRecords,
  currentPage,
  rowsPerPage,
  isLoading,
  onPageChange,
  onRowsPerPageChange,
}) => {
  return (
    <DataTable
      columns={columns}
      data={data}
      progressPending={isLoading}
      progressComponent={<Loading />}
      pagination
      paginationServer
      paginationTotalRows={totalRecords}
      paginationDefaultPage={currentPage}
      paginationPerPage={rowsPerPage}
      onChangePage={onPageChange}
      onChangeRowsPerPage={onRowsPerPageChange}
    />
  );
};

export default CurrencyTable;

import React from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { CurrencyData } from "@/types/types";
import Loading from "@/app/dashboard/loading";

interface CurrencyTableProps {
  data: CurrencyData[] | Record<string, CurrencyData[]>;
  columns: TableColumn<CurrencyData>[];
  totalRecords: number;
  currentPage: number;
  rowsPerPage: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

const flattenGroupedData = (
  groupedData: Record<string, CurrencyData[]>,
): CurrencyData[] => {
  return Object.values(groupedData).flat();
};

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
  const isGroupedData = !Array.isArray(data);
  const flattenedData = isGroupedData
    ? flattenGroupedData(data as Record<string, CurrencyData[]>)
    : data;

  return (
    <div>
      {isGroupedData &&
        Object.keys(data as Record<string, CurrencyData[]>).map((groupKey) => (
          <h2 key={groupKey} className="my-2 text-xl font-semibold">
            {groupKey}
          </h2>
        ))}

      <DataTable
        columns={columns}
        data={flattenedData}
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
    </div>
  );
};

export default CurrencyTable;

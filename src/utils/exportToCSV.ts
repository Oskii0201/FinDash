import { unparse } from "papaparse";
import { CurrencyData } from "@/types/types";

interface ColumnDefinition {
  name: string;
  selector: (row: CurrencyData) => string | number;
}

type FormattedRow = Record<string, string | number>;

export const exportToCSV = (
  data: CurrencyData[] | Record<string, CurrencyData[]>,
  columns: ColumnDefinition[],
  filename: string,
): void => {
  if (!data || Object.keys(data).length === 0) {
    console.warn("Brak danych do eksportu");
    return;
  }

  const formattedData: FormattedRow[] = [];

  if (Array.isArray(data)) {
    formattedData.push(
      ...data.map((row) =>
        columns.reduce<FormattedRow>((acc, col) => {
          acc[col.name] = col.selector(row);
          return acc;
        }, {}),
      ),
    );
  } else {
    Object.entries(data).forEach(([group, items]) => {
      items.forEach((row) => {
        const formattedRow: FormattedRow = columns.reduce<FormattedRow>(
          (acc, col) => {
            acc[col.name] = col.selector(row);
            return acc;
          },
          {},
        );
        formattedRow["Group"] = group;
        formattedData.push(formattedRow);
      });
    });
  }

  const csv = unparse(formattedData);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

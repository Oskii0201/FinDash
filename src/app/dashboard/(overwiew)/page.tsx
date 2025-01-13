"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/Button";

interface Rate {
  currency: string;
  rate: number;
  date: string;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [rates, setRates] = useState<Rate[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/currencies");
      const data = await response.json();
      if (response.ok) {
        setRates(data);
        setMessage("");
      } else {
        setMessage("Błąd podczas pobierania danych.");
      }
    } catch (error) {
      setMessage("Nie udało się pobrać danych.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="mb-6 text-2xl font-bold">Dashboard - Kursy walut</h1>

      <div className="mb-6 flex flex-col items-start sm:flex-row sm:items-center sm:justify-between">
        <Button onClick={fetchRates}>
          {loading ? "Fetching..." : "Pobierz kursy walut"}
        </Button>
        {message && <p className="mt-4 text-red-500 sm:mt-0">{message}</p>}
      </div>

      {rates.length === 0 ? (
        <p className="text-gray-500">Brak danych do wyświetlenia.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse rounded-lg border border-gray-300 shadow-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Waluta
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Kurs
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Data
                </th>
              </tr>
            </thead>
            <tbody>
              {rates.map((rate, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100`}
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {rate.currency}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {rate.rate.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(rate.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

export default function DashboardPage() {
  const [rates, setRates] = useState<any[]>([]);

  useEffect(() => {
    const fetchRates = async () => {
      const response = await fetch("/api/exchange-rates/fetch");
      const data = await response.json();
      if (response.ok) {
        setRates(data);
      }
    };

    fetchRates();
  }, []);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("Kursy walut", 10, 10);

    doc.setFont("helvetica", "normal");
    doc.text("Nr", 10, 20);
    doc.text("Waluta", 30, 20);
    doc.text("Kurs", 80, 20);
    doc.text("Data", 120, 20);

    let y = 30;
    rates.forEach((rate, index) => {
      doc.text((index + 1).toString(), 10, y);
      doc.text(rate.currency, 30, y);
      doc.text(rate.rate.toFixed(2), 80, y);
      doc.text(new Date(rate.date).toLocaleDateString(), 120, y);
      y += 10;
    });

    doc.save("kursy-walut.pdf");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Kursy walut</h1>
      <button
        onClick={exportToPDF}
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
      >
        Eksportuj do PDF
      </button>
      {rates.length === 0 ? (
        <p>Brak danych do wyświetlenia.</p>
      ) : (
        <table className="mt-4 w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Waluta</th>
              <th className="border border-gray-300 px-4 py-2">Kurs</th>
              <th className="border border-gray-300 px-4 py-2">Data</th>
            </tr>
          </thead>
          <tbody>
            {rates.map((rate, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">
                  {rate.currency}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {rate.rate}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(rate.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

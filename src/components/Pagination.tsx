"use client";

import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

/**
 * Pagination Component
 *
 * @property {number} currentPage - The current active page.
 * @property {number} totalPages - The total number of pages available.
 * @property {number} pageSize - Number of records per page.
 * @property {number[]} pageSizeOptions - Array of options for records per page.
 * @property {(page: number) => void} onPageChange - Callback function triggered when the page changes.
 * @property {(size: number) => void} onPageSizeChange - Callback function triggered when the page size changes.
 */
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePrevious = () => {
    if (!isFirstPage) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (!isLastPage) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
      <div className="flex items-center gap-2">
        <label htmlFor="pageSize" className="text-sm font-medium text-gray-700">
          Records:
        </label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevious}
          aria-label="Previous page"
          disabled={isFirstPage}
          className={`flex items-center justify-center rounded border p-2 text-sm font-medium ${
            isFirstPage
              ? "cursor-not-allowed bg-gray-200 text-gray-500"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          <FaArrowLeft />
        </button>
        <span className="text-sm font-medium text-gray-700">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={handleNext}
          aria-label="Next page"
          disabled={isLastPage}
          className={`flex items-center justify-center rounded border p-2 text-sm font-medium ${
            isLastPage
              ? "cursor-not-allowed bg-gray-200 text-gray-500"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}

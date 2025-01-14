"use client";

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (start: Date | null, end: Date | null) => void;
  startLabel?: string;
  endLabel?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onDateChange,
  startLabel = "Start Date",
  endLabel = "End Date",
}) => {
  const [start, setStart] = useState<Date | null>(startDate);
  const [end, setEnd] = useState<Date | null>(endDate);

  useEffect(() => {
    setStart(startDate);
    setEnd(endDate);
  }, [startDate, endDate]);

  const handleStartDateChange = (date: Date | null) => {
    setStart(date);
    onDateChange(date, end);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEnd(date);
    onDateChange(start, date);
  };

  return (
    <div className="flex flex-col items-center gap-4 md:flex-row">
      <div>
        <label
          htmlFor="start-date"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {startLabel}
        </label>
        <DatePicker
          id="start-date"
          dateFormat="yyyy/MM/dd"
          selected={start}
          onChange={handleStartDateChange}
          selectsStart
          startDate={start}
          endDate={end}
          className="w-full rounded border px-2 py-1 text-sm"
          placeholderText="Select start date"
        />
      </div>
      <div>
        <label
          htmlFor="end-date"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {endLabel}
        </label>
        <DatePicker
          dateFormat="yyyy/MM/dd"
          id="end-date"
          selected={end}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={start}
          endDate={end}
          minDate={start || undefined}
          className="w-full rounded border px-2 py-1 text-sm"
          placeholderText="Select end date"
        />
      </div>
    </div>
  );
};

export default DateRangePicker;

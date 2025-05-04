import React from "react";

interface SelectProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: {
    value: string;
    label: string;
  }[];
  className?: string;
}

export function Select({ id, value, onChange, options, className = "" }: SelectProps) {
  return (
    <select
      className={`rounded-md border p-2 ${className}`}
      id={id}
      value={value}
      onChange={onChange}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

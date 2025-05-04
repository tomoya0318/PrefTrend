import React from "react";

import { Select } from "@/components/atoms/select";

interface LabeledSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: {
    value: string;
    label: string;
  }[];
  className?: string;
}

export function LabeledSelect({
  id,
  label,
  value,
  onChange,
  options,
  className = "",
}: LabeledSelectProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <label className="mr-2 font-medium" htmlFor={id}>
        {label}:
      </label>
      <Select id={id} options={options} value={value} onChange={onChange} />
    </div>
  );
}

import React from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  options: Option[];
  multiple?: boolean;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export function Select({
  label,
  value,
  onChange,
  options,
  multiple = false,
  placeholder = 'Select...',
  error,
  disabled = false,
  required = false,
}: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          multiple={multiple}
          value={value}
          onChange={(e) => {
            if (multiple) {
              const selected = Array.from(e.target.selectedOptions, (option) => option.value);
              onChange(selected);
            } else {
              onChange(e.target.value);
            }
          }}
          disabled={disabled}
          className="input-field appearance-none pr-10"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-3 h-5 w-5 text-gray-400" />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

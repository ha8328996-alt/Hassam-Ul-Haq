import React, { SelectHTMLAttributes, forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className = '', id, ...rest }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`w-full text-xs sm:text-sm rounded-lg border bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 disabled:opacity-50 py-2 px-3 ${
            error
              ? 'border-rose-500 focus:ring-rose-500'
              : 'border-neutral-300 dark:border-neutral-800'
          } ${className}`}
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

import React, { TableHTMLAttributes, HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';

export function Table({ className = '', children, ...rest }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
      <table className={`w-full text-left text-xs border-collapse ${className}`} {...rest}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className = '', children, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={`bg-neutral-50 dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium ${className}`}
      {...rest}
    >
      {children}
    </thead>
  );
}

export function TableBody({ className = '', children, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={`divide-y divide-neutral-100 dark:divide-neutral-800/60 ${className}`} {...rest}>
      {children}
    </tbody>
  );
}

export function TableRow({ className = '', children, ...rest }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={`hover:bg-neutral-50/70 dark:hover:bg-neutral-800/30 transition-colors ${className}`}
      {...rest}
    >
      {children}
    </tr>
  );
}

export function TableHead({
  className = '',
  children,
  align = 'left',
  ...rest
}: ThHTMLAttributes<HTMLTableCellElement> & { align?: 'left' | 'right' | 'center' }) {
  const alignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
  return (
    <th
      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 ${alignClass} ${className}`}
      {...rest}
    >
      {children}
    </th>
  );
}

export function TableCell({
  className = '',
  children,
  align = 'left',
  isNumeric = false,
  ...rest
}: TdHTMLAttributes<HTMLTableCellElement> & { align?: 'left' | 'right' | 'center'; isNumeric?: boolean }) {
  const alignClass = align === 'right' || isNumeric ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
  return (
    <td
      className={`px-4 py-3 text-xs text-neutral-800 dark:text-neutral-200 ${
        isNumeric ? 'font-mono tabular-nums' : ''
      } ${alignClass} ${className}`}
      {...rest}
    >
      {children}
    </td>
  );
}

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, isValid } from 'date-fns';
import { DATE_FORMATS } from '@/lib/constants';

/**
 * Merges class names using clsx and tailwind-merge.
 * Handles conditional classes, arrays, and objects while resolving
 * Tailwind CSS class conflicts.
 *
 * @param {...(string|object|Array)} inputs - Class values to merge
 * @returns {string} Merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date value into a display-friendly string.
 *
 * @param {string|number|Date} date - The date to format
 * @param {string} [formatStr] - A date-fns format string (defaults to DATE_FORMATS.DISPLAY)
 * @returns {string} Formatted date string, or empty string if invalid
 */
export function formatDate(date, formatStr = DATE_FORMATS.DISPLAY) {
  if (!date) return '';

  try {
    let parsed;
    if (typeof date === 'string') {
      parsed = parseISO(date);
    } else if (date instanceof Date) {
      parsed = date;
    } else if (typeof date === 'number') {
      parsed = new Date(date);
    } else {
      return '';
    }

    if (!isValid(parsed)) return '';

    return format(parsed, formatStr);
  } catch {
    return '';
  }
}

/**
 * Formats a number with locale-aware separators and optional decimal places.
 *
 * @param {number} value - The number to format
 * @param {object} [options] - Intl.NumberFormat options
 * @param {number} [options.minimumFractionDigits=0] - Minimum decimal places
 * @param {number} [options.maximumFractionDigits=2] - Maximum decimal places
 * @returns {string} Formatted number string, or '—' if value is not a finite number
 */
export function formatNumber(value, options = {}) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return '—';
  }

  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    ...rest
  } = options;

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
    ...rest,
  }).format(value);
}

/**
 * Formats a number as US currency.
 *
 * @param {number} value - The monetary value
 * @param {string} [currency='USD'] - ISO 4217 currency code
 * @returns {string} Formatted currency string, or '—' if value is not a finite number
 */
export function formatCurrency(value, currency = 'USD') {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return '—';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Generates a unique identifier string.
 *
 * @param {string} [prefix=''] - Optional prefix for the ID
 * @returns {string} A unique ID string
 */
export function generateId(prefix = '') {
  const random = Math.random().toString(36).substring(2, 11);
  const timestamp = Date.now().toString(36);
  const id = `${timestamp}${random}`;
  return prefix ? `${prefix}_${id}` : id;
}

/**
 * Masks personally identifiable information (PII) for display.
 * Supports SSN, phone numbers, email addresses, and generic strings.
 *
 * @param {string} value - The PII string to mask
 * @param {('ssn'|'phone'|'email'|'generic')} [type='generic'] - The type of PII
 * @returns {string} Masked string
 */
export function maskPII(value, type = 'generic') {
  if (!value || typeof value !== 'string') return '';

  switch (type) {
    case 'ssn': {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length < 4) return '***-**-****';
      return `***-**-${cleaned.slice(-4)}`;
    }
    case 'phone': {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length < 4) return '(***) ***-****';
      return `(***) ***-${cleaned.slice(-4)}`;
    }
    case 'email': {
      const atIndex = value.indexOf('@');
      if (atIndex <= 0) return '****@****';
      const firstChar = value[0];
      const domain = value.slice(atIndex);
      return `${firstChar}${'*'.repeat(Math.max(atIndex - 1, 1))}${domain}`;
    }
    case 'generic':
    default: {
      if (value.length <= 4) return '*'.repeat(value.length);
      const visible = value.slice(-4);
      return `${'*'.repeat(value.length - 4)}${visible}`;
    }
  }
}

/**
 * Creates a debounced version of a function that delays invocation
 * until after `delay` milliseconds have elapsed since the last call.
 *
 * @param {Function} fn - The function to debounce
 * @param {number} [delay=300] - Delay in milliseconds
 * @returns {Function} Debounced function with a `.cancel()` method
 */
export function debounce(fn, delay = 300) {
  let timeoutId = null;

  function debounced(...args) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delay);
  }

  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}

/**
 * Triggers a CSV file download in the browser.
 *
 * @param {Array<object>} data - Array of objects to convert to CSV
 * @param {string} [filename='export.csv'] - The download filename
 */
export function downloadCSV(data, filename = 'export.csv') {
  if (!Array.isArray(data) || data.length === 0) return;

  try {
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((header) => {
            const cell = row[header] ?? '';
            const cellStr = String(cell);
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          })
          .join(',')
      ),
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch {
    // Silently fail in non-browser environments
  }
}

/**
 * Triggers a JSON file download in the browser.
 *
 * @param {*} data - Data to serialize as JSON
 * @param {string} [filename='export.json'] - The download filename
 */
export function downloadJSON(data, filename = 'export.json') {
  if (data === undefined || data === null) return;

  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch {
    // Silently fail in non-browser environments
  }
}

/**
 * Extracts initials from a full name string.
 *
 * @param {string} name - Full name (e.g. "John Doe")
 * @param {number} [maxInitials=2] - Maximum number of initials to return
 * @returns {string} Uppercase initials (e.g. "JD")
 */
export function getInitials(name, maxInitials = 2) {
  if (!name || typeof name !== 'string') return '';

  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';

  return parts
    .slice(0, maxInitials)
    .map((part) => part[0].toUpperCase())
    .join('');
}

/**
 * Truncates text to a specified length and appends an ellipsis.
 *
 * @param {string} text - The text to truncate
 * @param {number} [maxLength=100] - Maximum character length before truncation
 * @param {string} [suffix='…'] - The suffix to append when truncated
 * @returns {string} Truncated text or original if within limit
 */
export function truncateText(text, maxLength = 100, suffix = '…') {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength).trimEnd() + suffix;
}

/**
 * Calculates a percentage from a numerator and denominator.
 *
 * @param {number} numerator - The numerator value
 * @param {number} denominator - The denominator value
 * @param {number} [decimalPlaces=1] - Number of decimal places to round to
 * @returns {number} The calculated percentage, or 0 if denominator is 0 or inputs are invalid
 */
export function calculatePercentage(numerator, denominator, decimalPlaces = 1) {
  if (
    !Number.isFinite(numerator) ||
    !Number.isFinite(denominator) ||
    denominator === 0
  ) {
    return 0;
  }

  const percentage = (numerator / denominator) * 100;
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(percentage * factor) / factor;
}
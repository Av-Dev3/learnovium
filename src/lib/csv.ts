/**
 * CSV Export Utilities
 */

/**
 * Convert array of objects to CSV string
 */
export function toCSV<T extends Record<string, unknown>>(
  data: T[],
  options: {
    headers?: string[];
    delimiter?: string;
    includeHeaders?: boolean;
  } = {}
): string {
  const { delimiter = ",", includeHeaders = true } = options;
  
  if (data.length === 0) {
    return "";
  }

  // Get headers from first object or use provided headers
  const headers = options.headers || Object.keys(data[0]);
  
  // Escape CSV value
  const escapeValue = (value: unknown): string => {
    if (value === null || value === undefined) {
      return "";
    }
    
    const str = String(value);
    
    // If the value contains delimiter, newlines, or quotes, wrap in quotes and escape quotes
    if (str.includes(delimiter) || str.includes("\n") || str.includes("\r") || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    
    return str;
  };

  const lines: string[] = [];
  
  // Add headers if requested
  if (includeHeaders) {
    lines.push(headers.map(escapeValue).join(delimiter));
  }
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => escapeValue(row[header]));
    lines.push(values.join(delimiter));
  }
  
  return lines.join("\n");
}

/**
 * Download CSV file in browser
 */
export function downloadCSV(
  data: Record<string, unknown>[],
  filename: string,
  options?: {
    headers?: string[];
    delimiter?: string;
  }
): void {
  const csv = toCSV(data, options);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  
  // Create download link
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
}

/**
 * Format data for CSV export with common transformations
 */
export function formatForCSV<T extends Record<string, unknown>>(
  data: T[],
  transformers: Partial<Record<keyof T, (value: unknown) => string>> = {}
): T[] {
  return data.map(row => {
    const formatted = { ...row } as Record<string, unknown>;
    
    for (const [key, transformer] of Object.entries(transformers)) {
      if (key in formatted && transformer) {
        formatted[key] = transformer(formatted[key]);
      }
    }
    
    return formatted as T;
  });
}

/**
 * Common CSV transformers
 */
export const csvTransformers = {
  // Format dates to ISO string
  date: (value: unknown): string => {
    if (!value) return "";
    const date = new Date(value as string | number | Date);
    return isNaN(date.getTime()) ? String(value) : date.toISOString();
  },
  
  // Format numbers to specific decimal places
  currency: (decimals = 4) => (value: unknown): string => {
    const num = parseFloat(value as string);
    return isNaN(num) ? String(value) : num.toFixed(decimals);
  },
  
  // Format booleans
  boolean: (value: unknown): string => {
    return value ? "true" : "false";
  },
  
  // Format JSON objects
  json: (value: unknown): string => {
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return String(value);
  },
  
  // Truncate long text
  truncate: (maxLength = 100) => (value: unknown): string => {
    const str = String(value);
    return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
  },
};

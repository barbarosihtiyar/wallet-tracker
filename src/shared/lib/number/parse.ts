/**
 * Parses a number from string, handling locale-specific formatting
 * Removes commas and other thousand separators
 */
export const parseNumber = (value: string | number | undefined): number => {
  if (typeof value === "number") return value;
  if (!value) return 0;

  const cleaned = String(value).replace(/,/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

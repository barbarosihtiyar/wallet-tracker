import i18n from "@/shared/i18n";

const resolveLocale = (lang?: string) => {
  if (!lang) return undefined;
  if (lang === "tr") return "tr-TR";
  if (lang === "ar") return "ar-SA";
  return "en-US";
};

export const formatLocalNumber = (
  value?: number | null,
  opts?: Intl.NumberFormatOptions,
): string => {
  if (value === null || value === undefined) return "-";
  return new Intl.NumberFormat(resolveLocale(i18n.language), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 20,
    ...opts,
  }).format(value);
};

export const getFormattedAmountProps = (
  value: number | undefined,
  isFocused: boolean,
): { value: string } => {
  if (value === undefined || value === null) {
    return { value: "" };
  }

  return {
    value: isFocused ? String(value) : formatLocalNumber(value),
  };
};

export { parseNumber } from "./parse";

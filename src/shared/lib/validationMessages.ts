import i18n from "@/shared/i18n";

export type TabValidationMessageKey =
  | "mustQueryTransaction"
  | "mustQuerySender"
  | "mustFillForm"
  | "mustSelectPaymentOption"
  | "mustSelectCancelReason";

export const getTabValidationMessage = (
  key: TabValidationMessageKey,
  tab: string,
): string => i18n.t(`ui.validation.tabs.${key}`, { tab });

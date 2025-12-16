import { Rule } from "antd/es/form";
import { TFunction } from "i18next";

export const getEmailRules = (t: TFunction): Rule[] => [
  {
    required: true,
    message: t("ui.validation.email.required"),
  },
  { type: "email", message: t("ui.validation.email.invalid") },
];

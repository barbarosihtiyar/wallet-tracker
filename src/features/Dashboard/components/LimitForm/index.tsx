import React, { useEffect } from "react";
import { Form } from "antd";
import { useTranslation } from "react-i18next";

import { Button, Input } from "@/components";
import { useErrorTranslation } from "@/shared/hooks";
import { UpdateWalletLimitPayload } from "@/shared/types/api";

type Props = {
  customerId?: string;
  currency?: string;
  loading?: boolean;
  onSubmit: (payload: UpdateWalletLimitPayload) => Promise<void> | void;
  availableLimit?: number;
  dailyLimit?: number;
};

const LimitForm: React.FC<Props> = ({
  customerId,
  currency: propCurrency = "TRY",
  loading,
  onSubmit,
  availableLimit,
  dailyLimit,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<UpdateWalletLimitPayload>();
  const watchedCurrency = Form.useWatch("currency", form);
  const currency = watchedCurrency || propCurrency;

  useErrorTranslation(form);

  useEffect(() => {
    form.setFieldsValue({
      customerId,
      availableLimit,
      dailyLimit,
    });
  }, [form, customerId, availableLimit, dailyLimit, currency]);

  const handleFinish = (values: UpdateWalletLimitPayload) => {
    if (!customerId) return;
    onSubmit({
      ...values,
      customerId,
    });
  };

  return (
    <div className="dashboard-limit-form">
      <div className="dashboard-limit-form__header">
        <p className="dashboard-limit-form__eyebrow">
          {t("dashboard.forms.limit.eyebrow")}
        </p>
        <h3 className="dashboard-limit-form__title">
          {t("dashboard.forms.limit.title")}
        </h3>
        <p className="dashboard-limit-form__description">
          {t("dashboard.forms.limit.description")}
        </p>
      </div>

      <Form
        form={form}
        onFinish={handleFinish}
        requiredMark={false}
        layout="vertical"
      >
        <div className="dashboard-limit-form__fields">
          <div className="dashboard-limit-form__field">
            <Form.Item
              name="availableLimit"
              label={t("dashboard.forms.limit.fields.availableLimit")}
              dependencies={["dailyLimit"]}
              rules={[
                { required: true, message: t("validation.required") },
                () => ({
                  validator(_, value) {
                    const available = Number(value);
                    const daily = Number(form.getFieldValue("dailyLimit"));

                    if (Number.isNaN(available)) {
                      return Promise.reject(t("validation.required"));
                    }
                    if (available < 250) {
                      return Promise.reject(t("validation.minLimit"));
                    }
                    if (available > 1000000) {
                      return Promise.reject(
                        t("validation.maxLimit", { value: "1,000,000" }),
                      );
                    }
                    if (!Number.isNaN(daily) && available < daily) {
                      return Promise.reject(t("validation.availableVsDaily"));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input
                inputType="number"
                suffix={currency}
                placeholder={t(
                  "dashboard.forms.limit.placeholders.availableLimit",
                )}
              />
            </Form.Item>
          </div>

          <div className="dashboard-limit-form__field">
            <Form.Item
              name="dailyLimit"
              label={t("dashboard.forms.limit.fields.dailyLimit")}
              dependencies={["availableLimit"]}
              rules={[
                { required: true, message: t("validation.required") },
                () => ({
                  validator(_, value) {
                    const daily = Number(value);
                    const available = Number(
                      form.getFieldValue("availableLimit"),
                    );

                    if (Number.isNaN(daily)) {
                      return Promise.reject(t("validation.required"));
                    }
                    if (daily < 100) {
                      return Promise.reject(t("validation.minDailyLimit"));
                    }
                    if (daily > 1000000) {
                      return Promise.reject(
                        t("validation.maxLimit", { value: "1,000,000" }),
                      );
                    }
                    if (!Number.isNaN(available) && daily > available) {
                      return Promise.reject(t("validation.dailyVsAvailable"));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input
                inputType="number"
                suffix={currency}
                placeholder={t("dashboard.forms.limit.placeholders.dailyLimit")}
              />
            </Form.Item>
          </div>
        </div>

        <div className="dashboard-limit-form__actions">
          <Button
            htmlType="submit"
            isLoading={loading}
            disabled={!customerId}
            aria-label={t("dashboard.forms.limit.submit")}
          >
            {loading
              ? t("dashboard.forms.limit.submitting")
              : t("dashboard.forms.limit.submit")}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default LimitForm;

import React, { useEffect } from "react";
import { Form } from "antd";
import { useTranslation } from "react-i18next";

import { Button, Input, SelectV1 } from "@/components";
import { useErrorTranslation } from "@/shared/hooks";
import { CreateCustomerPayload } from "@/shared/types/api";
import { currencyOptions } from "@/shared/dummy/dashboard";

type Props = {
  loading?: boolean;
  onSubmit: (payload: CreateCustomerPayload) => Promise<void> | void;
  initialValues?: Partial<CreateCustomerPayload>;
};

const CustomerForm: React.FC<Props> = ({
  loading,
  onSubmit,
  initialValues,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<CreateCustomerPayload>();
  const currency = Form.useWatch("currency", form) || "TRY";

  useErrorTranslation(form);

  const parseNumber = (val: unknown) =>
    typeof val === "number" ? val : Number(val);

  useEffect(() => {
    form.setFieldsValue({
      currency: "TRY",
      dateOfBirth: "",
      nationalId: "",
      address: {
        country: "",
        city: "",
        postalCode: "",
        line1: "",
      },
      ...initialValues,
    });
  }, [form, initialValues]);

  const handleFinish = (values: CreateCustomerPayload) => {
    onSubmit({
      ...values,
      availableLimit: parseNumber(values.availableLimit),
      dailyLimit: parseNumber(values.dailyLimit),
      nationalId: parseNumber(values.nationalId),
    });
  };

  return (
    <div className="dashboard-form">
      <div className="dashboard-form__header">
        <p className="dashboard-form__eyebrow">
          {t("dashboard.forms.customer.eyebrow")}
        </p>
        <h3 className="dashboard-form__title">
          {t("dashboard.forms.customer.title")}
        </h3>
        <p className="dashboard-form__description">
          {t("dashboard.forms.customer.description")}
        </p>
        <span className="dashboard-form__badge">
          {t("dashboard.forms.customer.realtime")}
        </span>
      </div>

      <Form
        form={form}
        onFinish={handleFinish}
        requiredMark={false}
        layout="vertical"
      >
        <div className="dashboard-form__body">
          <Form.Item
            name="name"
            label={t("dashboard.forms.customer.fields.name")}
            rules={[
              { required: true, message: t("validation.required") },
              { min: 3, message: t("validation.minChars", { count: 3 }) },
            ]}
          >
            <Input
              placeholder={t("dashboard.forms.customer.placeholders.name")}
              maxLength={50}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={t("dashboard.forms.customer.fields.email")}
            rules={[
              { required: true, message: t("validation.required") },
              { type: "email", message: t("validation.email") },
            ]}
          >
            <Input
              inputType="email"
              placeholder={t("dashboard.forms.customer.placeholders.email")}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label={t("dashboard.forms.customer.fields.phone")}
            rules={[
              { required: true, message: t("validation.required") },
              {
                min: 8,
                message: t("validation.minChars", { count: 8 }),
              },
            ]}
          >
            <Input
              inputType="text"
              placeholder={t("dashboard.forms.customer.placeholders.phone")}
            />
          </Form.Item>

          <Form.Item
            name="nationalId"
            label={t("dashboard.forms.customer.fields.nationalId")}
            rules={[
              { required: true, message: t("validation.required") },
              () => ({
                validator(_, value) {
                  const digits = String(value ?? "").replace(/\D/g, "");
                  if (digits.length !== 11) {
                    return Promise.reject(
                      t("validation.minChars", { count: 11 }),
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              inputType="text"
              placeholder={t(
                "dashboard.forms.customer.placeholders.nationalId",
              )}
              maxLength={11}
            />
          </Form.Item>

          <Form.Item
            name="dateOfBirth"
            label={t("dashboard.forms.customer.fields.dateOfBirth")}
            rules={[{ required: true, message: t("validation.required") }]}
          >
            <Input
              inputType="date"
              placeholder={t(
                "dashboard.forms.customer.placeholders.dateOfBirth",
              )}
            />
          </Form.Item>

          <div className="dashboard-form__section">
            <h4 className="dashboard-form__section-title">
              {t("dashboard.forms.customer.sections.address")}
            </h4>

            <Form.Item
              name={["address", "country"]}
              label={t("dashboard.forms.customer.fields.country")}
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <Input
                placeholder={t("dashboard.forms.customer.placeholders.country")}
              />
            </Form.Item>

            <Form.Item
              name={["address", "city"]}
              label={t("dashboard.forms.customer.fields.city")}
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <Input
                placeholder={t("dashboard.forms.customer.placeholders.city")}
              />
            </Form.Item>

            <Form.Item
              name={["address", "postalCode"]}
              label={t("dashboard.forms.customer.fields.postalCode")}
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <Input
                placeholder={t(
                  "dashboard.forms.customer.placeholders.postalCode",
                )}
              />
            </Form.Item>

            <Form.Item
              name={["address", "line1"]}
              label={t("dashboard.forms.customer.fields.line1")}
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <Input
                placeholder={t("dashboard.forms.customer.placeholders.line1")}
              />
            </Form.Item>
          </div>

          <div className="dashboard-form__section">
            <h4 className="dashboard-form__section-title">
              {t("dashboard.forms.customer.sections.wallet")}
            </h4>

            <Form.Item
              name="availableLimit"
              label={t("dashboard.forms.customer.fields.availableLimit")}
              dependencies={["dailyLimit"]}
              rules={[
                { required: true, message: t("validation.required") },
                () => ({
                  validator(_, value) {
                    const available = parseNumber(value);
                    const daily = parseNumber(form.getFieldValue("dailyLimit"));

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
                placeholder={t("dashboard.forms.customer.placeholders.limit")}
              />
            </Form.Item>

            <Form.Item
              name="dailyLimit"
              label={t("dashboard.forms.customer.fields.dailyLimit")}
              dependencies={["availableLimit"]}
              rules={[
                { required: true, message: t("validation.required") },
                () => ({
                  validator(_, value) {
                    const daily = parseNumber(value);
                    const available = parseNumber(
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
                placeholder={t(
                  "dashboard.forms.customer.placeholders.dailyLimit",
                )}
              />
            </Form.Item>

            <Form.Item
              name="currency"
              label={t("dashboard.forms.customer.fields.currency")}
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <SelectV1
                data={currencyOptions.map((code) => ({
                  value: code,
                  label: code,
                }))}
                placeholder={t(
                  "dashboard.forms.customer.placeholders.currency",
                )}
                onChange={(val) => {
                  const limit = form.getFieldValue("availableLimit");
                  const daily = form.getFieldValue("dailyLimit");
                  form.setFieldsValue({
                    currency: val,
                    availableLimit: limit,
                    dailyLimit: daily,
                  });
                }}
              />
            </Form.Item>
          </div>

          <div className="dashboard-form__actions">
            <Button
              htmlType="submit"
              type="dark"
              isLoading={loading}
              aria-label={t("dashboard.forms.customer.submit")}
            >
              {loading
                ? t("dashboard.forms.customer.submitting")
                : t("dashboard.forms.customer.submit")}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default CustomerForm;

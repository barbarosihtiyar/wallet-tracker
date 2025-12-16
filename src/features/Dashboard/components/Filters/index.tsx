import React, { useMemo } from "react";
import { Form } from "antd";
import { useTranslation } from "react-i18next";

import { Button, Input, SelectV2 } from "@/components";
import { DashboardFilters } from "@/redux/slices/Dashboard/types";
import { KycStatus, WalletStatus } from "@/shared/types/api";

type Props = {
  filters: DashboardFilters;
  onChange: (filters: Partial<DashboardFilters>) => void;
  onReset: () => void;
};

const statusOptions: { value: WalletStatus | "all"; label: string }[] = [
  { value: "all", label: "all" },
  { value: "active", label: "active" },
  { value: "restricted", label: "restricted" },
  { value: "suspended", label: "suspended" },
];

const kycStatusOptions: { value: KycStatus | "all"; label: string }[] = [
  { value: "all", label: "all" },
  { value: "UNKNOWN", label: "UNKNOWN" },
  { value: "UNVERIFIED", label: "UNVERIFIED" },
  { value: "VERIFIED", label: "VERIFIED" },
  { value: "CONTRACTED", label: "CONTRACTED" },
];

const isActiveOptions: { value: "all" | "true" | "false"; label: string }[] = [
  { value: "all", label: "all" },
  { value: "true", label: "active" },
  { value: "false", label: "inactive" },
];

const Filters: React.FC<Props> = ({ filters, onChange, onReset }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const statusData = useMemo(
    () =>
      statusOptions.map((item) => ({
        value: item.value,
        label: t(`dashboard.filters.status.${item.label}`),
      })),
    [t],
  );

  const kycStatusData = useMemo(
    () =>
      kycStatusOptions.map((item) => ({
        value: item.value,
        label: t(`dashboard.filters.kycStatus.${item.label}`),
      })),
    [t],
  );

  const isActiveData = useMemo(
    () =>
      isActiveOptions.map((item) => ({
        value: item.value,
        label: t(`dashboard.filters.isActive.${item.label}`),
      })),
    [t],
  );

  const handleFinish = (values: DashboardFilters) => {
    onChange({ ...values, page: 1 });
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      initialValues={filters}
      layout="vertical"
      className="dashboard-filters"
    >
      <div className="dashboard-filters__grid">
        <div className="dashboard-filters__field">
          <Form.Item
            name="search"
            label={t("dashboard.filters.search")}
            style={{ marginBottom: 0 }}
          >
            <Input
              allowClear
              placeholder={t("dashboard.filters.searchPlaceholder")}
            />
          </Form.Item>
        </div>

        <div className="dashboard-filters__field">
          <Form.Item
            name="status"
            label={t("dashboard.filters.statusLabel")}
            style={{ marginBottom: 0 }}
          >
            <SelectV2 data={statusData} />
          </Form.Item>
        </div>

        <div className="dashboard-filters__field">
          <Form.Item
            name="kycStatus"
            label={t("dashboard.filters.kycStatusLabel")}
            style={{ marginBottom: 0 }}
          >
            <SelectV2 data={kycStatusData} />
          </Form.Item>
        </div>

        <div className="dashboard-filters__field">
          <Form.Item
            name="isActive"
            label={t("dashboard.filters.isActiveLabel")}
            style={{ marginBottom: 0 }}
          >
            <SelectV2 data={isActiveData} />
          </Form.Item>
        </div>
      </div>

      <div className="dashboard-filters__actions">
        <Button
          type="lightRedBorder"
          onClick={handleReset}
          aria-label="reset-filters"
        >
          {t("dashboard.filters.reset")}
        </Button>
        <Button htmlType="submit" aria-label="apply-filters">
          {t("dashboard.filters.apply")}
        </Button>
      </div>
    </Form>
  );
};

export default Filters;

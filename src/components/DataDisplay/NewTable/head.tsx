import { Form } from "antd";
import type { RuleObject } from "antd/es/form";
import classNames from "classnames";
import dayjs, { Dayjs } from "dayjs";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, DatePicker, Icon, Input, SelectV1 } from "@/components";
import { Icons } from "@/shared/constants";
import { useErrorTranslation } from "@/shared/hooks";

import type { FilterItem, Props } from "./types";

const Filter: React.FC<Props> = ({
  formRef,
  onFilterFunc,
  filterActionName,
  filterConfig,
}) => {
  const [isActiveFilter, setActiveFilter] = useState(false);
  const { t } = useTranslation();

  useErrorTranslation(formRef);

  const resetFilter = () => {
    formRef.resetFields();
    onFilterFunc();
  };

  const labelSwitcher = (el?: string) => {
    switch (el) {
      case "Name":
        return t("filter.name");
      case "Surname":
        return t("filter.surname");
      case "Begin Date":
        return t("filter.begindate");
      case "End Date":
        return t("filter.enddate");
      case "Status":
        return t("filter.status");
      case "Payment Method":
        return t("filter.paymentmethod");
      default:
        return t(el ?? "");
    }
  };

  const FilterInput: React.FC<{ item: FilterItem }> = ({ item }) => (
    <Form.Item name={item.key} key={`filter-input-${item.key}`}>
      <Input
        iconLeft={typeof item.icon === "string" ? item.icon : undefined}
        label={labelSwitcher(item.label)}
        inputType="text"
        placeholder={labelSwitcher(item.placeholder)}
      />
    </Form.Item>
  );

  const FilterSelect: React.FC<{ item: FilterItem }> = ({ item }) => {
    const data =
      item?.input?.options?.map((o) => ({ label: o.key, value: o.value })) ??
      [];
    return (
      <Form.Item name={item.key}>
        <SelectV1
          label={labelSwitcher(item.label)}
          data={data}
          placeholder={labelSwitcher(item.placeholder)}
          onChange={(val) => {
            formRef.setFieldsValue({ [item.key]: val });
          }}
        />
      </Form.Item>
    );
  };

  const FilterDatepicker: React.FC<{ item: FilterItem }> = ({ item }) => (
    <Form.Item className="ant-form-item--date">
      <span className="input__label">
        {item.label && labelSwitcher(item.label)}
      </span>
      <Form.Item
        name={item.key}
        className="ant-form-item--date"
        rules={
          item.key === "EndDate"
            ? [
                {
                  validator: async (_rule: RuleObject, endDatetime?: Dayjs) => {
                    const startDatetime = formRef.getFieldValue("BeginDate") as
                      | Dayjs
                      | undefined;
                    if (
                      startDatetime &&
                      endDatetime &&
                      endDatetime <= startDatetime
                    ) {
                      return Promise.reject(
                        new Error(t("ui.validation.dateTime.greaterThanStart")),
                      );
                    }
                  },
                },
              ]
            : undefined
        }
      >
        <DatePicker
          placeholder={t("filter.dd")}
          disabledDate={(current) =>
            item.key === "EndDate" &&
            filterActionName !== "pay-link" &&
            !!current &&
            dayjs(current).isAfter(dayjs(), "day")
          }
        />
      </Form.Item>
    </Form.Item>
  );

  const renderFilterInput = (item: FilterItem) => {
    switch (item?.input?.type) {
      case "textbox":
        return <FilterInput item={item} />;
      case "datepicker":
        return <FilterDatepicker item={item} />;
      case "select":
        return <FilterSelect item={item} />;
      default:
        return null;
    }
  };

  return (
    <div className="new-table__head">
      <div className="new-table__head__actions">
        <Button
          className={classNames({ active: isActiveFilter })}
          onClick={() => setActiveFilter((p) => !p)}
          type="light"
        >
          {t("general.filter")}
        </Button>
        {isActiveFilter && (
          <Button
            onClick={() => setActiveFilter(false)}
            className="filter-close"
            iconOnly={<Icon name={Icons.CLOSE} />}
          />
        )}
      </div>

      {isActiveFilter && (
        <div className="new-table__head__filter">
          <Form form={formRef} className="form--filter" onFinish={onFilterFunc}>
            <div className="form__inputs">
              {filterConfig?.map((item, index) => (
                <React.Fragment key={`${item.key}-${index}`}>
                  {renderFilterInput(item)}
                </React.Fragment>
              ))}
              <div className="filter__actions">
                <Button htmlType="submit" type="dark">
                  {t("ui.button.submit")}
                </Button>
                <Button htmlType="button" onClick={resetFilter} type="light">
                  {t("ui.button.reset")}
                </Button>
              </div>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
};

export default Filter;

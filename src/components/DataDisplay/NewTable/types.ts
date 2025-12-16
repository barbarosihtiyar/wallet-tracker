import type { FormInstance, TableProps } from 'antd';
import type { ReactElement } from 'react';

export type OptionItem = { key: string; value: string | number };

export type FilterItem = {
  key: string;
  label?: string;
  placeholder?: string;
  icon?: string;
  input?: {
    type: 'textbox' | 'datepicker' | 'select';
    options?: OptionItem[];
  };
};

export type Props = {
  formRef: FormInstance;
  onFilterFunc: () => void;
  filterActionName?: string;
  filterConfig?: FilterItem[];
};

type UnknownRecord = Record<string, unknown>;

export type TableFuncProps<RecordType extends UnknownRecord = UnknownRecord> = {
  changeEmpty?: boolean;
  form?: { getFieldsValue: () => UnknownRecord } | null;
  column: TableProps<RecordType>['columns'];
  dataSource?: RecordType[];
  elementNumber?: number;
  totalNumber?: number;
  setPageNumberOut?: (page: number) => void;
  filterAction?: (payload: UnknownRecord) => unknown;
  emptyText?: string;
  emptyImg?: ReactElement;
  extraParams?: UnknownRecord;
  filter: Boolean;
  pageSize?: number;
  sortableColumns?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: string) => void;
} & Omit<TableProps<RecordType>, 'columns' | 'dataSource' | 'locale'>;

export const EMPTY_DATA: never[] = [];

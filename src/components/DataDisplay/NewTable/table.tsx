import './new-table.scss';

import { Pagination, Table } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { EmptyComp, Icon } from '@/components';
import { useAppDispatch } from '@/shared/hooks';

import { TableFuncProps } from './types';

const TableFunc: React.FC<TableFuncProps> = ({
  changeEmpty = false,
  form,
  column,
  dataSource,
  elementNumber,
  totalNumber,
  setPageNumberOut,
  filterAction,
  emptyText,
  emptyImg,
  extraParams,
  pageSize = 10,
  sortableColumns = [],
  sortBy,
  sortOrder = 'asc',
  onSort,
  ...props
}) => {
  const dispatch = useAppDispatch();
  const initialPage =
    typeof props.pagination === 'object' && props.pagination?.current
      ? props.pagination.current
      : 1;
  const [pageNumber, setPageNumber] = useState(initialPage);
  const { t } = useTranslation();
  const EMPTY_DATA: never[] = [];

  useEffect(() => {
    if (typeof props.pagination === 'object' && props.pagination?.current) {
      setPageNumber(props.pagination.current);
    }
  }, [props.pagination]);

  const enhancedColumns = useMemo(() => {
    return column?.map(col => {
      const fieldKey =
        ('dataIndex' in col && (col as any).dataIndex) ||
        ('key' in col && col.key) ||
        '';

      if (typeof fieldKey === 'string' && sortableColumns.includes(fieldKey) && onSort) {
        return {
          ...col,
          title: <span>{(col as any).title ?? fieldKey}</span>,
          sorter: true,
          onHeaderCell: () => ({
            onClick: () => onSort(fieldKey),
          }),
        };
      }

      return col;
    });
  }, [column, sortableColumns, sortBy, sortOrder, onSort]);

  const locale = {
    emptyText: (
      <EmptyComp
        type="v2"
        img={emptyImg || <Icon name="empty/not-payments" />}
        text={emptyText}
      />
    ),
  };

  const onAction = (values: Record<string, unknown>, pageNumber: number) => {
    setPageNumber(pageNumber);
    setPageNumberOut?.(pageNumber);

    const trimmedValues: Record<string, unknown> = {};
    for (const key in values) {
      if (Object.prototype.hasOwnProperty.call(values, key)) {
        trimmedValues[key] =
          typeof values[key] === 'string' ? values[key].trim() : values[key];
      }
    }

    if (filterAction) {
      const action = filterAction({
        ...trimmedValues,
        ...extraParams,
        pageNumber: pageNumber,
        pageSize,
      }) as Parameters<typeof dispatch>[0];

      dispatch(action);
    }
  };

  return (
    <>
      <div className={classNames('table ', { 'table--empty': changeEmpty })}>
        <Table
          {...props}
          locale={locale as unknown as Record<string, string>}
          dataSource={changeEmpty ? EMPTY_DATA : dataSource}
          columns={enhancedColumns}
          pagination={false}
        />
      </div>
      {props.pagination !== false && !!elementNumber && !!totalNumber && (
        <Pagination
          total={totalNumber}
          showTotal={(total, range) => (
            <Trans
              t={t}
              i18nKey="ui.pagination.showTotal"
              components={{ span: <span /> }}
              values={{
                currentItem: pageNumber === 1 ? 1 : range[0],
                onPage: range[1],
                totalCards: total,
              }}
            />
          )}
          showSizeChanger={false}
          showQuickJumper={false}
          defaultPageSize={pageSize}
          onChange={p => {
            setPageNumber(p);
            onAction(form?.getFieldsValue?.() ?? {}, p);
          }}
          current={pageNumber}
          pageSize={pageSize}
        />
      )}
    </>
  );
};

export default TableFunc;

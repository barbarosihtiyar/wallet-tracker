import dayjs, { Dayjs } from 'dayjs';

export interface BuildQueryOptions {
  withPrefix?: boolean;
  skipEmptyString?: boolean;
  arrayStyle?: 'repeat' | 'comma';
  dateFormat?: string;
}

type PaginatedLike<T> =
  | {
      items?: T[];
      data?: T[];
      meta?: Record<string, unknown>;
      total?: number;
      totalCount?: number;
      page?: number;
      pageSize?: number;
      page_size?: number;
      currentPage?: number;
    }
  | T[];

const isNull = (v: unknown): v is null | undefined => v == null;

const isDayjsInstance = (v: unknown): v is Dayjs => dayjs.isDayjs(v);

const asStrings = (v: unknown, fmt: string): string[] => {
  if (isNull(v)) return [];

  if (v instanceof Date) {
    return [dayjs(v).format(fmt)];
  }

  if (isDayjsInstance(v)) {
    return [v.format(fmt)];
  }

  if (typeof v === 'boolean') {
    return [v ? 'true' : 'false'];
  }

  return [String(v)];
};

export const buildPaginationQuery = (
  params: Record<string, unknown>,
  opts: BuildQueryOptions = {}
): string => {
  const {
    withPrefix = true,
    skipEmptyString = true,
    arrayStyle = 'repeat',
    dateFormat = 'YYYY-MM-DD',
  } = opts;

  const sp = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      const items = value
        .flatMap(v => asStrings(v, dateFormat))
        .filter(s => !(skipEmptyString && s === ''));
      if (!items.length) return;

      if (arrayStyle === 'comma') sp.append(key, items.join(','));
      else items.forEach(s => sp.append(key, s));

      return;
    }

    asStrings(value, dateFormat).forEach(s => {
      if (skipEmptyString && s === '') return;
      sp.append(key, s);
    });
  });

  const qs = sp.toString();
  return withPrefix ? (qs ? `?${qs}` : '') : qs;
};

export const normalizePaginated = <T>(
  payload: PaginatedLike<T>,
  defaults: { page?: number; pageSize?: number } = {}
) => {
  const items =
    (Array.isArray((payload as any)?.items) && (payload as any).items) ||
    (Array.isArray((payload as any)?.data) && (payload as any).data) ||
    (Array.isArray(payload) && (payload as any)) ||
    [];

  const meta = (payload as any)?.meta ?? {};
  const page =
    meta.page ??
    meta.currentPage ??
    (payload as any)?.page ??
    (payload as any)?.currentPage ??
    defaults.page ??
    1;
  const pageSize =
    (meta.pageSize ??
      meta.page_size ??
      (payload as any)?.pageSize ??
      (payload as any)?.page_size ??
      defaults.pageSize ??
      items.length) ||
    10;
  const total =
    meta.total ??
    meta.totalCount ??
    (payload as any)?.total ??
    (payload as any)?.totalCount ??
    items.length;

  return {
    items,
    meta: {
      page: page || 1,
      pageSize,
      total,
      totalCount: total,
    },
    total,
    totalCount: total,
  };
};

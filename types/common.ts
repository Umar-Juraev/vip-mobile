// types/common.ts
export type Nullable<T> = T | null;

export type ID = number | string;

export interface PaginatedResponse<T> {
  data: T;
  count: number;
  total: number;
  page: number;
  pageCount: number;
}

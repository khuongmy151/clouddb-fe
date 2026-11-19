export interface PaginationResponse<T> {
  content: T[];
  page: number;        // số trang hiện tại (0-based)
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
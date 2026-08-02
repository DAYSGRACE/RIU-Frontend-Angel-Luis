export interface PaginationRequestDTO {
  page: number;
  perPage: number;
  // TODO -> Agregar orden
  sort: PaginationSortRequestDTO;
}

export interface PaginationSortRequestDTO {
  [propName: string]: SortRequestType;
}

export type SortRequestType = '+' | '-';

export interface PaginationResponseDTO<T> {
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
  data: T[];
}

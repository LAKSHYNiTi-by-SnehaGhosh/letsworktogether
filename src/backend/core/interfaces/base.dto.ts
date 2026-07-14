export interface BaseDTO {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationDTO {
  page: number;
  limit: number;
  total?: number;
}

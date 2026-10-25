export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  [key: string]: unknown;
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta: ApiMeta;
}

export interface ApiErrorField {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error: {
    code: string;
    requestId?: string;
    field?: string;
    details?: Record<string, unknown>;
    errors?: ApiErrorField[];
  };
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number,
    public field?: string,
    public fieldErrors: ApiErrorField[] = [],
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

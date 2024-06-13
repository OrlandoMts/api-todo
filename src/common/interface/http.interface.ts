export interface ResponseHttpItf<T> {
  // message: string;
  data: T;
  ok: boolean;
}

export interface DataHttpItf<T> {
  data: T;
  count?: number;
  page?: number;
  message?: string;
}

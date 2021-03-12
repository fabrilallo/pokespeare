import { Method } from "got";

export interface RequestParams {
    path: string;
    method: Method;
    body?: Record<string, unknown>;
    queryParams?: string | Record<string, string | number | boolean | null | undefined>;
}

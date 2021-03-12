import got, { Response } from "got";

import { RequestParams } from "./typings/httpClient";

const DEFAULT_GOT_TIMEOUT = 30000;
const RETRY_LIMIT = 5;
export async function makeHttpRequest<T>(
    prefixUrl: string,
    requestParams: RequestParams,
): Promise<Response<T>> {
    const request = got.extend({
        prefixUrl,
        searchParams: requestParams.queryParams,
        json: requestParams.body,
        method: requestParams.method,
        responseType: "json",
        throwHttpErrors: false,
        timeout: DEFAULT_GOT_TIMEOUT,
        retry: {
            limit: RETRY_LIMIT,
        },
    });

    const response = await request<T>(`${requestParams.path}`);

    return response;
}

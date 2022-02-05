import type { Either } from 'fp-ts/Either';
type ClientHeaders = Record<string, string>;

declare enum ResponseType {
    TEXT = 'text',
    JSON = 'json'
}

export type RequestOptions = {
    headers?: ClientHeaders;
    method: string;
};

type RequestProps<B, Q> = {
    body?: B;
    query?: Q;
    method: COMMON.Method;
}

export type Query = Record<string, string | string[]>;

export interface HttpEngine {
    request<T extends BodyInit, R>(
        url: COMMON.Url,
        requestOptions: RequestOptions,
        data?: T,
    ): Promise<Either<Error, R>>;
    request<T, R>(
        url: COMMON.Url,
        requestOptions: RequestOptions,
        data?: T,
    ): Promise<Either<Error, R>>;
}

export interface HttpClient {
    url(url: COMMON.Url): HttpClient;
    addOptions(options: RequestOptions): HttpClient;
    query<T extends Query>(query: T): HttpClient;
    request<R, B, Q extends Query>(requestProps: RequestProps<B, Q>): Promise<Either<Error, R>>;
    get<R, Q extends Query>(query: Q): Promise<Either<Error, R>>;
    head<R>(): Promise<Either<Error, R>>;
    post<R, B>(body: B): Promise<Either<Error, R>>;
    put<R, B>(body: B): Promise<Either<Error, R>>;
    patch<R, B>(body: B): Promise<Either<Error, R>>;
    delete<R>(): Promise<Either<Error, R>>;
    options<R>(): Promise<Either<Error, R>>;
}

export as namespace HTTP;

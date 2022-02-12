import type { Either } from 'fp-ts/Either';
type Headers = Record<string, string | string[]>;

declare enum ResponseType {
	TEXT = 'text',
	JSON = 'json'
}

export type RequestOptions = {
	headers?: Headers;
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
	): ResponseResultPromise<R>;
	request<T, R>(
		url: COMMON.Url,
		requestOptions: RequestOptions,
		data?: T,
	): ResponseResultPromise<R>;
}

export type Response = {
	headers: Headers;
	status: number;
	statusText: string;
	url?: string;
}

export type ResultPayload<T> = {
	data: T;
	response: Response;
}

type ResponseResultPromise<T> = Promise<Either<Error, ResultPayload<T>>>;

export interface HttpClient {
	url(url: COMMON.Url): HttpClient;
	addOptions(options: RequestOptions): HttpClient;
	query<T extends Query>(query: T): HttpClient;
	request<R, B, Q extends Query>(requestProps: RequestProps<B, Q>): ResponseResultPromise<R>;
	get<R, Q extends Query>(query: Q): ResponseResultPromise<R>;
	head<R>(): ResponseResultPromise<R>;
	post<R, B>(body: B): ResponseResultPromise<R>;
	put<R, B>(body: B): ResponseResultPromise<R>;
	patch<R, B>(body: B): ResponseResultPromise<R>;
	delete<R>(): ResponseResultPromise<R>;
	options<R>(): ResponseResultPromise<R>;
}

export as namespace HTTP;

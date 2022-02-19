import type * as COMMON from './common';
import type { Either } from 'fp-ts/Either';

export type Headers = Record<string, string | string[]>;

export type RequestOptions = {
	headers?: Headers;
	method: string;
};

export type RequestOptionsProps = {
	headers?: Headers;
	method?: string;
};

export type RequestProps<B> = {
	url?: COMMON.Url;
	body?: B;
	query?: URLSearchParams;
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

export type ResponseResultPromise<T> = Promise<Either<Error, ResultPayload<T>>>;

export interface HttpClient {
	addOptions(options: RequestOptionsProps): HttpClient;
	send<R, B>(request: HttpRequest<B>): ResponseResultPromise<R>;
}

export type HttpClientInitProps = {
	engine: HttpEngine,
	baseUrl?: COMMON.Url
}

export type HttpRequest<TBody> = {
	url?: COMMON.Url;
	requestOptions: RequestOptions;
	body?: TBody;
	query?: URLSearchParams
}

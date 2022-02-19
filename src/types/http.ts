import type * as COMMON from './common';

export type Headers = Record<string, string | string[]>;
export type Query = Record<string, string | number | Array<string | number>>;
export type Body = Record<string, unknown> | string | Blob | ArrayBuffer;

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

export type ResultPayload<TData> = {
	data: TData;
	response: Response;
}

export type Ok<TResult> = {
	readonly kind: 'ok';
	readonly result: ResultPayload<TResult>;
}

export type Failure<TError> = {
	readonly kind: 'failure';
	readonly error: TError;
}

export type Result<TError, TResult> = Failure<TError> | Ok<TResult>;

export type ResponseResultPromise<TData> = Promise<Result<Error, TData>>;

export interface HttpClient {
	addOptions(options: RequestOptionsProps): HttpClient;
	send<TData>(request: HttpRequest): ResponseResultPromise<TData>;
}

export type HttpClientInitProps = {
	engine: HttpEngine,
	baseUrl?: COMMON.Url
}

export type HttpRequest = {
	url?: COMMON.Url;
	requestOptions: RequestOptions;
	body?: Body;
	query?: Query;
}

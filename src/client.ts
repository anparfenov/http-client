import type * as HTTP from './types/http';
import type * as COMMON from './types/common';

export class HttpClient implements HTTP.HttpClient {
	#engine: HTTP.HttpEngine;
	#baseUrl: COMMON.Url;
	#requestOptions: HTTP.RequestOptions = { method: 'get' };

	constructor({ engine, baseUrl }: HTTP.HttpClientInitProps) {
		this.#engine = engine;
		this.#baseUrl = baseUrl ?? '/';
	}

	#resolveUrl<T>(url: COMMON.Url = '', searchParams?: T): string {
		if (url !== '' && url.startsWith('http')) {
			return this.#buildUrlWithSearchParams(url, searchParams);
		}
		if (url !== '' && this.#baseUrl) {
			if (url.startsWith('/') && this.#baseUrl.startsWith('/')) {
				return this.#buildUrlWithSearchParams<T>(this.#baseUrl + url.substring(1), searchParams);
			}
			return this.#buildUrlWithSearchParams<T>(this.#baseUrl + url, searchParams);
		}
		return this.#buildUrlWithSearchParams(this.#baseUrl, searchParams);
	}

	#buildSearchParams<T>(searchString: string, params: T): string {
		const searchParams = new URLSearchParams(searchString);
		if (typeof params === 'string') {
			if (params.startsWith('?')) {
				return searchString + params.substring(1);
			}
			return searchString + params;
		}
		Object.entries(params).forEach(([k, v]) => {
			if (Array.isArray(v)) {
				v.forEach((vItem) => {
					searchParams.append(k, vItem);
				});
				return;
			}
			searchParams.append(k, v as string);
		});
		return searchParams.toString();
	}

	#buildUrlWithSearchParams<T>(url: string, searchParams?: T): string {
		if (searchParams) {
			const _url = new URL(url);
			_url.search = this.#buildSearchParams<T>(_url.search, searchParams);
			return _url.href;
		}
		return url;
	}

	addOptions(options: HTTP.RequestOptionsProps): HttpClient {
		// TODO deep merge
		this.#requestOptions = { ...this.#requestOptions, ...options };
		return this;
	}

	send<R, B>(request: HTTP.HttpRequest<B>): HTTP.ResponseResultPromise<R> {
		const url = this.#resolveUrl(request.url, request.query);
		return this.#engine.request(url, { ...this.#requestOptions, ...request.requestOptions }, request.body);
	}
}

export class HttpClient implements HTTP.HttpClient {
	#engine: HTTP.HttpEngine;
	#baseUrl: COMMON.Url;
	#url: COMMON.Url;
	#requestOptions: HTTP.RequestOptions = { method: 'get' };

	constructor({engine, baseUrl}: HTTP.HttpClientInitProps) {
		this.#engine = engine;
		this.#baseUrl = baseUrl ?? '/';
		this.#url = this.#baseUrl;
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

	query<Q extends HTTP.Query>(query: Q): HttpClient {
		this.#url = this.#buildUrlWithSearchParams(this.#url, query);
		return this;
	}

	url(url: COMMON.Url): HttpClient {
		this.#url = this.#resolveUrl(url);
		return this;
	}

	addOptions(options: HTTP.RequestOptions): HttpClient {
		// TODO deep merge
		this.#requestOptions = { ...this.#requestOptions, ...options };
		return this;
	}

	request<R, B, Q extends HTTP.Query>({ method, body, query }: HTTP.RequestProps<B, Q>): HTTP.ResponseResultPromise<R> {
		if (query) {
			this.query(query);
		}
		this.addOptions({ method });
		return this.#engine.request(this.#url, this.#requestOptions, body);
	}

	get<R, Q extends HTTP.Query>(query?: Q): HTTP.ResponseResultPromise<R> {
		return this.request({ method: 'get', query });
	}
	head<R>(): HTTP.ResponseResultPromise<R> {
		return this.request({ method: 'head' });
	}
	post<R, B>(body?: B): HTTP.ResponseResultPromise<R> {
		return this.request({ method: 'post', body });
	}
	put<R, B>(body?: B): HTTP.ResponseResultPromise<R> {
		return this.request({ method: 'put', body });
	}
	patch<R, B>(body?: B): HTTP.ResponseResultPromise<R> {
		return this.request({ method: 'patch', body });
	}
	delete<R>(): HTTP.ResponseResultPromise<R> {
		return this.request({ method: 'delete' });
	}
	options<R>(): HTTP.ResponseResultPromise<R> {
		return this.request({ method: 'options' });
	}
}

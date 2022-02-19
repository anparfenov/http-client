import type * as HTTP from './types/http';
import type * as COMMON from './types/common';

export class HttpRequestBuilder<TBody> {
	#url?: COMMON.Url;
	#requestOptions: HTTP.RequestOptions = { method: 'get' };
	#body?: TBody;
	#query?: URLSearchParams;

	addOptions(options: HTTP.RequestOptionsProps): HttpRequestBuilder<TBody> {
		// TODO deep merge
		this.#requestOptions = { ...this.#requestOptions, ...options };
		return this;
	}

	body(body: TBody): HttpRequestBuilder<TBody> {
		this.#body = body;
		return this;
	}

	url(url: COMMON.Url): HttpRequestBuilder<TBody> {
		this.#url = url;
		return this
	}

	query(query: URLSearchParams): HttpRequestBuilder<TBody> {
		this.#query = query;
		return this
	}

	get(): HttpRequestBuilder<TBody> {
		return this.addOptions({ method: 'get' });
	}
	head(): HttpRequestBuilder<TBody> {
		return this.addOptions({ method: 'head' });
	}
	post(): HttpRequestBuilder<TBody> {
		return this.addOptions({ method: 'post' });
	}
	put(): HttpRequestBuilder<TBody> {
		return this.addOptions({ method: 'put' });
	}
	patch(): HttpRequestBuilder<TBody> {
		return this.addOptions({ method: 'patch' });
	}
	delete(): HttpRequestBuilder<TBody> {
		return this.addOptions({ method: 'delete' });
	}
	options(): HttpRequestBuilder<TBody> {
		return this.addOptions({ method: 'opitons' });
	}

	build(): HTTP.HttpRequest<TBody> {
		return {
			url: this.#url,
			query: this.#query,
			body: this.#body,
			requestOptions: this.#requestOptions,
		}
	}
}

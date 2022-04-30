import type * as HTTP from "./types/http";
import type * as COMMON from "./types/common";
import { deepMerge } from "./utils/merge";

export class HttpRequestBuilder {
	#url?: COMMON.Url;
	#requestOptions: HTTP.RequestOptions = { method: "get" };
	#body?: HTTP.Body;
	#query?: HTTP.Query;

	addOptions(options: HTTP.RequestOptionsProps): HttpRequestBuilder {
		this.#requestOptions = deepMerge(
			this.#requestOptions,
			options
		) as HTTP.RequestOptions;
		return this;
	}

	body(body: HTTP.Body): HttpRequestBuilder {
		this.#body = body;
		return this;
	}

	url(url: COMMON.Url): HttpRequestBuilder {
		this.#url = url;
		return this;
	}

	query(query: HTTP.Query): HttpRequestBuilder {
		this.#query = query;
		return this;
	}

	headers(headers: HTTP.Headers): HttpRequestBuilder {
		this.addOptions({ headers });
		return this;
	}

	get(): Omit<HttpRequestBuilder, COMMON.Method> {
		return this.addOptions({ method: "get" });
	}
	head(): Omit<HttpRequestBuilder, COMMON.Method> {
		return this.addOptions({ method: "head" });
	}
	post(): Omit<HttpRequestBuilder, COMMON.Method> {
		return this.addOptions({ method: "post" });
	}
	put(): Omit<HttpRequestBuilder, COMMON.Method> {
		return this.addOptions({ method: "put" });
	}
	patch(): Omit<HttpRequestBuilder, COMMON.Method> {
		return this.addOptions({ method: "patch" });
	}
	delete(): Omit<HttpRequestBuilder, COMMON.Method> {
		return this.addOptions({ method: "delete" });
	}
	options(): Omit<HttpRequestBuilder, COMMON.Method> {
		return this.addOptions({ method: "options" });
	}

	build(): HTTP.HttpRequest {
		return {
			url: this.#url,
			query: this.#query,
			body: this.#body,
			requestOptions: this.#requestOptions,
		};
	}
}

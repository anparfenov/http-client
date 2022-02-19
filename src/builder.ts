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

	get(): HttpRequestBuilder {
		return this.addOptions({ method: "get" });
	}
	head(): HttpRequestBuilder {
		return this.addOptions({ method: "head" });
	}
	post(): HttpRequestBuilder {
		return this.addOptions({ method: "post" });
	}
	put(): HttpRequestBuilder {
		return this.addOptions({ method: "put" });
	}
	patch(): HttpRequestBuilder {
		return this.addOptions({ method: "patch" });
	}
	delete(): HttpRequestBuilder {
		return this.addOptions({ method: "delete" });
	}
	options(): HttpRequestBuilder {
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

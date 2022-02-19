import { HttpError } from "./error";
import { makeError, makeOk, ResponseType } from "./common";
import type * as HTTP from "../types/http";
import type * as COMMON from "../types/common";

export class HttpBrowserEngine implements HTTP.HttpEngine {
	#adaptOptions(options: HTTP.RequestOptions): RequestInit {
		return {
			method: options.method ?? "get",
			headers: options.headers as HeadersInit,
		};
	}

	#getContentType(headers: Headers): ResponseType {
		const contentType = headers.get("content-type");
		if (contentType) {
			if (contentType.includes("application/json")) {
				return ResponseType.JSON;
			} else if (contentType.includes("text/plain")) {
				return ResponseType.TEXT;
			}
		}
		return ResponseType.TEXT;
	}

	#adaptHeaders(headers: Headers): HTTP.Headers {
		let acc: HTTP.Headers = {};
		headers.forEach((value, key) => {
			acc[key] = value;
		})
		return acc;
	}

	#appendBody<T extends BodyInit>(options: RequestInit, body: T): RequestInit {
		return { ...options, body };
	}

	async request<T extends BodyInit, R>(
		url: COMMON.Url,
		requestOptions: HTTP.RequestOptions = { method: "get" },
		data?: T
	): HTTP.ResponseResultPromise<R> {
		let adaptedOptions = this.#adaptOptions(requestOptions);
		if (data) {
			adaptedOptions = this.#appendBody(adaptedOptions, data);
		}
		try {
			const response = await fetch(url, adaptedOptions);
			const contentType = this.#getContentType(response.headers);
			const data = await response[contentType]();
			if (response.ok) {
				return makeOk({
					data,
					response: {
						headers: this.#adaptHeaders(response.headers),
						status: response.status,
						statusText: response.statusText,
						url: response.url,
					},
				});
			}
			throw new HttpError({
				status: response.status,
				message: response.statusText,
			});
		} catch (e) {
			if (e instanceof HttpError) {
				return makeError(e);
			} else if (e instanceof Error) {
				return makeError(e);
			} else if (typeof e === "string") {
				return makeError(new Error(e));
			}
			return makeError(new Error("unknown error"));
		}
	}
}

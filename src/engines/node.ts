import https from "node:https";
import http from "node:http";

import { HttpError } from "./error";
import { makeOk, makeError, ResponseType } from "./common";
import type * as HTTP from "../types/http";
import type * as COMMON from "../types/common";

export class HttpNodeEngine implements HTTP.HttpEngine {
	#adaptOptions(options: HTTP.RequestOptions): https.RequestOptions {
		return {
			...options,
			method: options.method ?? "get",
			headers: options.headers,
		};
	}

	#adaptHeaders(headers: http.IncomingHttpHeaders): HTTP.Headers {
		const acc: HTTP.Headers = {};
		Object.entries(headers).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				acc[key] = value.join(',');
			} else if (value) {
				acc[key] = value;
			}
		})
		return acc;
	}

	#promisifiedRequest<R>(
		url: any,
		options: any,
		data?: any
	): Promise<HTTP.ResultPayload<R>> {
		return new Promise((resolve, reject) => {
			const req = https.request(
				url,
				options,
				async (messageStream: http.IncomingMessage) => {
					messageStream.setEncoding("utf-8");
					try {
						if (messageStream.statusCode && messageStream.statusCode > 399) {
							throw new HttpError({
								status: messageStream.statusCode,
								message: messageStream.statusMessage ?? "error",
							});
						}
						let responseType: ResponseType = ResponseType.TEXT;
						if (messageStream.headers["content-type"] && messageStream.headers["content-type"].includes("application/json")) {
							responseType = ResponseType.JSON;
						}
						let response = "";
						for await (let chunk of messageStream) {
							response += chunk;
						}

						let result;
						if (responseType === ResponseType.JSON) {
							result = JSON.parse(response);
						}
						resolve({
							data: result,
							response: {
								headers: this.#adaptHeaders(messageStream.headers),
								status: messageStream.statusCode ?? 200,
								statusText: messageStream.statusMessage ?? "Ok"
							},
						});
					} catch (e) {
						if (e instanceof HttpError) {
							reject(e);
						} else if (e instanceof Error) {
							reject(new HttpError({ status: 400, message: e.message }));
						} else if (typeof e === "string") {
							reject(new HttpError({ status: 400, message: e }));
						}
						reject(new HttpError({ status: 400, message: "unknown error" }));
					}
				}
			);
			// TODO: we should also write Buffer
			if (data) {
				if (typeof data === 'string') {
					req.write(data);
				} else {
					req.write(JSON.stringify(data));
				}
			}
			req.end();
		});
	}
	async request<T, R>(
		url: COMMON.Url,
		requestOptions: HTTP.RequestOptions = { method: "get" },
		data?: T
	): HTTP.ResponseResultPromise<R> {
		const options = this.#adaptOptions(requestOptions);
		try {
			const res = await this.#promisifiedRequest<R>(url, options, data);
			return makeOk(res);
		} catch (e: unknown) {
			if (e instanceof HttpError) {
				return makeError(e);
			}
			if (e instanceof Error) {
				return makeError(e);
			}
			return makeError(new Error("unknown error"));
		}
	}
}

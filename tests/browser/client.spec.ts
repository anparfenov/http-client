import { suite } from "uvu";
import * as assert from "uvu/assert";
import {
	HttpBrowserEngine,
	HttpClient,
	HttpRequestBuilder,
	HttpError,
	isOk,
	isError,
} from "../../src/browser";

// @ts-ignore
const rest = MockServiceWorker.rest;
// @ts-ignore
const setupWorker = MockServiceWorker.setupWorker;
const handlers = [
	rest.get("https://localhost:3000/test", (req, res, ctx) => {
		return res(
			ctx.status(200),
			ctx.json({
				hello: "hello",
			})
		);
	}),

	rest.get("https://localhost:3000/not-found", (req, res, ctx) => {
		return res(ctx.status(404));
	}),

	rest.get("https://localhost:3000/add", (req, res, ctx) => {
		const { searchParams } = req.url;
		const a = searchParams.get("a");
		const b = searchParams.get("b");

		return res(
			ctx.json({
				c: Number(a) + Number(b),
			}),
			ctx.status(200)
		);
	}),

	rest.post("https://localhost:3000/add", (req, res, ctx) => {
		const { a, b } = JSON.parse(req.body as string) as {
			a: number;
			b: number;
		};
		console.log('POST add', a, b);

		return res(
			ctx.json({
				c: a + b,
			}),
			ctx.status(200)
		);
	}),

	rest.put("https://localhost:3000/add", (req, res, ctx) => {
		const { a, b } = JSON.parse(req.body as string) as {
			a: number;
			b: number;
		};

		return res(
			ctx.json({
				c: a + b,
			}),
			ctx.status(200)
		);
	}),

	rest.patch("https://localhost:3000/add", (req, res, ctx) => {
		const { a, b } = JSON.parse(req.body as string) as {
			a: number;
			b: number;
		};

		return res(
			ctx.json({
				c: a + b,
			}),
			ctx.status(200)
		);
	}),

	rest.delete("https://localhost:3000/remove", (req, res, ctx) => {
		return res(
			ctx.json({
				status: "deleted",
			}),
			ctx.status(200)
		);
	}),

	rest.options("https://localhost:3000/check", (req, res, ctx) => {
		const accessHeader = req.headers.get("Access-Control-Allow-Origin");

		return res(
			ctx.set("Access-Control-Allow-Origin", accessHeader ?? ""),
			ctx.status(204)
		);
	}),
];

const worker = setupWorker(...handlers);
worker.start().then(() => {
	const BrowserClientSuite = suite("Http client browser");

	BrowserClientSuite("should work", async function () {
		const client = new HttpClient({
			engine: new HttpBrowserEngine(),
			baseUrl: "https://localhost:3000",
		});
		const request = new HttpRequestBuilder().url("/test").get().build();
		const res = await client.send(request);
		assert.ok(isOk(res));
	});

	BrowserClientSuite(
		"should return a data field on get request",
		async function () {
			const client = new HttpClient({
				engine: new HttpBrowserEngine(),
				baseUrl: "https://localhost:3000",
			});
			const request = new HttpRequestBuilder().url("/test").get().build();
			const res = await client.send(request);
			if (isOk(res)) {
				assert.equal(res.result.data, { hello: "hello" });
			} else {
				throw new Error("incorrect");
			}
		}
	);

	BrowserClientSuite(
		"should return a response field on get request",
		async function () {
			const client = new HttpClient({
				engine: new HttpBrowserEngine(),
				baseUrl: "https://localhost:3000",
			});
			const request = new HttpRequestBuilder().url("/test").get().build();
			const res = await client.send(request);
			if (isOk(res)) {
				assert.equal(res.result.response, {
					status: 200,
					statusText: "OK",
					headers: {
						"content-type": "application/json",
						"x-powered-by": "msw",
					},
				});
			} else {
				throw new Error("incorrect");
			}
		}
	);

	BrowserClientSuite(
		"should make get request with params",
		async function () {
			const client = new HttpClient({
				engine: new HttpBrowserEngine(),
				baseUrl: "https://localhost:3000",
			});
			const request = new HttpRequestBuilder()
				.url("/add")
				.query({ a: 3, b: 4 })
				.get()
				.build();
			const res = await client.send<{ c: number }>(request);
			if (isOk(res)) {
				assert.is(res.result.data.c, 7);
			} else {
				throw new Error("incorrect");
			}
		}
	);

	BrowserClientSuite("should fail on 404", async function () {
		const client = new HttpClient({
			engine: new HttpBrowserEngine(),
			baseUrl: "https://localhost:3000",
		});
		const request = new HttpRequestBuilder()
			.url("/not-found")
			.get()
			.build();
		const res = await client.send(request);
		if (isError(res)) {
			assert.is((res.error as HttpError).status, 404);
		} else {
			throw new Error("incorrect");
		}
	});

	BrowserClientSuite(
		"should send json on post and recieve result",
		async function () {
			const client = new HttpClient({
				engine: new HttpBrowserEngine(),
				baseUrl: "https://localhost:3000",
			});
			const request = new HttpRequestBuilder()
				.url("/add")
				.body({ a: 2, b: 3 })
				.post()
				.build();
			const res = await client.send<{ c: number }>(request);
			if (isOk(res)) {
				assert.is(res.result.data.c, 5);
			} else {
				throw new Error("incorrect");
			}
		}
	);

	BrowserClientSuite(
		"should send json on put and recieve result",
		async function () {
			const client = new HttpClient({
				engine: new HttpBrowserEngine(),
				baseUrl: "https://localhost:3000",
			});
			const request = new HttpRequestBuilder()
				.url("/add")
				.body({ a: 3, b: 3 })
				.put()
				.build();
			const res = await client.send<{ c: number }>(request);
			if (isOk(res)) {
				assert.is(res.result.data.c, 6);
			} else {
				throw new Error("incorrect");
			}
		}
	);

	BrowserClientSuite(
		"should send json on patch and recieve result",
		async function () {
			const client = new HttpClient({
				engine: new HttpBrowserEngine(),
				baseUrl: "https://localhost:3000",
			});
			const request = new HttpRequestBuilder()
				.url("/add")
				.body({ a: 6, b: 10 })
				.patch()
				.build();
			const res = await client.send<{ c: number }>(request);
			if (isOk(res)) {
				assert.is(res.result.data.c, 16);
			} else {
				throw new Error("incorrect");
			}
		}
	);

	BrowserClientSuite(
		"should make delete request and recieve deleted status",
		async function () {
			const client = new HttpClient({
				engine: new HttpBrowserEngine(),
				baseUrl: "https://localhost:3000",
			});
			const request = new HttpRequestBuilder()
				.url("/remove")
				.body({ id: 1 })
				.delete()
				.build();
			const res = await client.send<{ status: string }>(request);

			if (isOk(res)) {
				assert.is(res.result.data.status, "deleted");
			} else {
				throw new Error("incorrect");
			}

			assert.ok(isOk(res));
		}
	);

	BrowserClientSuite(
		"should make options request and recieve headers",
		async function () {
			const client = new HttpClient({
				engine: new HttpBrowserEngine(),
				baseUrl: "https://localhost:3000",
			});
			const request = new HttpRequestBuilder()
				.url("/check")
				.headers({ "Access-Control-Allow-Origin": "*" })
				.options()
				.build();
			const res = await client.send(request);

			if (isOk(res)) {
				assert.equal(res.result.response, {
					status: 204,
					statusText: "No Content",
					headers: {
						"x-powered-by": "msw",
						"access-control-allow-origin": "*",
					},
				});
			} else {
				throw new Error("incorrect");
			}

			assert.ok(isOk(res));
		}
	);

	BrowserClientSuite.run();
});

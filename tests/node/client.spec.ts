import { server } from "../../src/mocks/server";
import { suite } from "uvu";
import * as assert from "uvu/assert";
import {
	HttpNodeEngine,
	HttpClient,
	HttpRequestBuilder,
	HttpError,
	isOk,
	isError,
} from "../../src/node";

const NodeClientSuite = suite("Http client node");

NodeClientSuite.before(() => server.listen());
NodeClientSuite.after.each(() => server.resetHandlers());
NodeClientSuite.after(() => server.close());

NodeClientSuite("should work", async function () {
	const client = new HttpClient({
		engine: new HttpNodeEngine(),
		baseUrl: "https://localhost:3000",
	});
	const request = new HttpRequestBuilder().url("/test").get().build();
	const res = await client.send(request);
	assert.ok(isOk(res));
});

NodeClientSuite("should return a data field on get request", async function () {
	const client = new HttpClient({
		engine: new HttpNodeEngine(),
		baseUrl: "https://localhost:3000",
	});
	const request = new HttpRequestBuilder().url("/test").get().build();
	const res = await client.send(request);
	if (isOk(res)) {
		assert.equal(res.result.data, { hello: "hello" });
	} else {
		throw new Error("incorrect");
	}
});

NodeClientSuite(
	"should return a response field on get request",
	async function () {
		const client = new HttpClient({
			engine: new HttpNodeEngine(),
			baseUrl: "https://localhost:3000",
		});
		const request = new HttpRequestBuilder().url("/test").get().build();
		const res = await client.send(request);
		if (isOk(res)) {
			assert.equal(res.result.response, {
				status: 200,
				statusText: "OK",
				url: "",
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

NodeClientSuite("should make get request with params", async function () {
	const client = new HttpClient({
		engine: new HttpNodeEngine(),
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
});

NodeClientSuite("should fail on 404", async function () {
	const client = new HttpClient({
		engine: new HttpNodeEngine(),
		baseUrl: "https://localhost:3000",
	});
	const request = new HttpRequestBuilder().url("/not-found").get().build();
	const res = await client.send(request);
	if (isError(res)) {
		assert.is((res.error as HttpError).status, 404);
	} else {
		throw new Error("incorrect");
	}
});

NodeClientSuite(
	"should send json on post and recieve result",
	async function () {
		const client = new HttpClient({
			engine: new HttpNodeEngine(),
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

NodeClientSuite(
	"should send json on put and recieve result",
	async function () {
		const client = new HttpClient({
			engine: new HttpNodeEngine(),
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

NodeClientSuite(
	"should send json on patch and recieve result",
	async function () {
		const client = new HttpClient({
			engine: new HttpNodeEngine(),
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

NodeClientSuite(
	"should make delete request and recieve deleted status",
	async function () {
		const client = new HttpClient({
			engine: new HttpNodeEngine(),
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

NodeClientSuite(
	"should make opitons request and recieve headers",
	async function () {
		const client = new HttpClient({
			engine: new HttpNodeEngine(),
			baseUrl: "https://localhost:3000",
		});
		const request = new HttpRequestBuilder()
			.url("/check")
			.headers({ 'Access-Control-Allow-Origin': '*' })
			.options()
			.build();
		const res = await client.send(request);

		if (isOk(res)) {
			assert.equal(res.result.response, { status: 204, statusText: 'No Content', url: '', headers: { 'x-powered-by': 'msw', 'access-control-allow-origin': '*' }});
		} else {
			throw new Error("incorrect");
		}

		assert.ok(isOk(res));
	}
);

NodeClientSuite.run();

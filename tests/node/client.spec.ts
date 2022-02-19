import { server } from "../../src/mocks/server";
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { HttpNodeEngine, HttpClient, HttpRequestBuilder, HttpError, isOk, isError } from "../../src/node";

const NodeClientSuite = suite('Http client node');

NodeClientSuite.before(() => server.listen());
NodeClientSuite.after.each(() => server.resetHandlers());
NodeClientSuite.after(() => server.close());

NodeClientSuite("should work", async function () {
	const client = new HttpClient({
		engine: new HttpNodeEngine(),
		baseUrl: "https://localhost:3000",
	});
	const request = new HttpRequestBuilder().url('/test').get().build();
	const res = await client.send(request);
	assert.ok(isOk(res));
});

NodeClientSuite("should return a data field on get request", async function () {
	const client = new HttpClient({
		engine: new HttpNodeEngine(),
		baseUrl: "https://localhost:3000",
	});
	const request = new HttpRequestBuilder().url('/test').get().build();
	const res = await client.send(request);
	if (isOk(res)) {
		assert.equal(res.right.data, { hello: "hello" });
	} else {
		throw new Error("incorrect");
	}
});

NodeClientSuite("should return a response field on get request", async function () {
	const client = new HttpClient({
		engine: new HttpNodeEngine(),
		baseUrl: "https://localhost:3000",
	});
	const request = new HttpRequestBuilder().url('/test').get().build();
	const res = await client.send(request);
	if (isOk(res)) {
		assert.equal(res.right.response, {
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
});

NodeClientSuite("should fail on 404", async function () {
	const client = new HttpClient({
		engine: new HttpNodeEngine(),
		baseUrl: "https://localhost:3000",
	});
	const request = new HttpRequestBuilder().url('/not-found').get().build();
	const res = await client.send(request);
	if (isError(res)) {
		assert.is((res.left as HttpError).status, 404);
	} else {
		throw new Error("incorrect");
	}
});

NodeClientSuite.run();

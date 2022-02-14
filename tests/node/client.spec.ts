import { server } from "../../src/mocks/server";
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
// import { expect } from "chai";
import { HttpNodeEngine, HttpClient, HttpError } from "../../src/node";
// TODO: add isRight function to the client
import { isRight, isLeft } from "fp-ts/Either";

const NodeClientSuite = suite('Http client node');

NodeClientSuite.before(() => server.listen());
NodeClientSuite.after.each(() => server.resetHandlers());
NodeClientSuite.after(() => server.close());

NodeClientSuite("should work", async function () {
	const client = new HttpClient({
		engine: new HttpNodeEngine(),
		baseUrl: "https://localhost:3000",
	});
	const res = await client.url("/test").get();
	assert.ok(isRight(res));
});

NodeClientSuite("should return a data field on get request", async function () {
	const client = new HttpClient({
		engine: new HttpNodeEngine(),
		baseUrl: "https://localhost:3000",
	});
	const res = await client
		.url("/test")
		.get<Record<string, string>, any>();
	if (isRight(res)) {
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
	const res = await client
		.url("/test")
		.get<Record<string, string>, any>();
	if (isRight(res)) {
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
	const res = await client.url("/not-found").get();
	if (isLeft(res)) {
		assert.is((res.left as HttpError).status, 404);
	} else {
		throw new Error("incorrect");
	}
});

NodeClientSuite.run();

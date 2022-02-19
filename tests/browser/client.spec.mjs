import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { HttpBrowserEngine, HttpClient, HttpRequestBuilder, isOk, isError } from '../../dist/bundle.esm.js';

const rest = MockServiceWorker.rest;
const setupWorker = MockServiceWorker.setupWorker;
const handlers = [
	rest.get('https://localhost:3000/test', (req, res, ctx) => {
		return res(
			ctx.status(200),
			ctx.json({
				hello: 'hello'
			})
		)
	}),

	rest.get('https://localhost:3000/not-found', (req, res, ctx) => {
		return res(
			ctx.status(404),
		)
	}),
]

const worker = setupWorker(...handlers)
worker.start().then(() => {
	const BrowserClientSuite = suite('Http client browser');

	BrowserClientSuite('should work', async function() {
		const client = new HttpClient({
			engine: new HttpBrowserEngine(),
			baseUrl: "https://localhost:3000",
		});
		const request = new HttpRequestBuilder().url('/test').get().build();
		const res = await client.send(request);
		assert.ok(isOk(res));
	});

	BrowserClientSuite('should return a data on get request', async function() {
		const client = new HttpClient({
			engine: new HttpBrowserEngine(),
			baseUrl: "https://localhost:3000",
		});
		const request = new HttpRequestBuilder().url('/test').get().build();
		const res = await client.send(request);
		if (isOk(res)) {
			assert.equal(res.right.data, { hello: 'hello' });
		} else {
			throw new Error('incorrect')
		}
	});

	BrowserClientSuite('should return a response field on get request', async function() {
		const client = new HttpClient({
			engine: new HttpBrowserEngine(),
			baseUrl: "https://localhost:3000",
		});
		const request = new HttpRequestBuilder().url('/test').get().build();
		const res = await client.send(request);
		if (isOk(res)) {
			assert.equal(res.right.response, {
				status: 200,
				statusText: "OK",
				url: "https://localhost:3000/test",
				headers: {
					"content-type": "application/json",
					"x-powered-by": "msw",
				},
			});
		} else {
			throw new Error('incorrect')
		}
	});

	BrowserClientSuite('should fail on 404', async function() {
		const client = new HttpClient({
			engine: new HttpBrowserEngine(),
			baseUrl: "https://localhost:3000",
		});
		const request = new HttpRequestBuilder().url('/not-found').get().build();
		const res = await client.send(request);
		if (isError(res)) {
			assert.is(res.left.status, 404);
		} else {
			throw new Error('incorrect')
		}
	});

	BrowserClientSuite.run();
});

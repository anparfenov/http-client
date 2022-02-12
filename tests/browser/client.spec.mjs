import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { HttpBrowserEngine, HttpClient, isOk, isError } from '../../dist/bundle.esm.js';

const rest = MockServiceWorker.rest;
const setupWorker = MockServiceWorker.setupWorker;
const handlers = [
    rest.post('/login', (req, res, ctx) => {

        // Persist user's authentication in the session

        sessionStorage.setItem('is-authenticated', 'true')

        return res(

            // Respond with a 200 status code

            ctx.status(200),

        )

    }),

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

    rest.get('/user', (req, res, ctx) => {

        // Check if the user is authenticated in this session

        const isAuthenticated = sessionStorage.getItem('is-authenticated')

        if (!isAuthenticated) {

            // If not authenticated, respond with a 403 error

            return res(

                ctx.status(403),

                ctx.json({

                    errorMessage: 'Not authorized',

                }),

            )

        }

        // If authenticated, return a mocked user details

        return res(

            ctx.status(200),

            ctx.json({

                username: 'admin',

            }),

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
		const res = await client.url('/test').get();
		assert.ok(isOk(res));
	});

	BrowserClientSuite('should return a data on get request', async function() {
		const client = new HttpClient({
			engine: new HttpBrowserEngine(),
			baseUrl: "https://localhost:3000",
		});
		const res = await client.url('/test').get();
		if (isOk(res)) {
			assert.equal(res.right.data, { hello: 'hello' });
		} else {
			throw new Error('incorrect')
		}
	});

	BrowserClientSuite('should fail on 404', async function() {
		const client = new HttpClient({
			engine: new HttpBrowserEngine(),
			baseUrl: "https://localhost:3000",
		});
		const res = await client.url('/not-found').get();
		if (isError(res)) {
			assert.is(res.left.status, 404);
		} else {
			throw new Error('incorrect')
		}
	});

	BrowserClientSuite.run();
});

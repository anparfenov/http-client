import { rest } from 'msw';

export const handlers = [
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

	rest.get('https://localhost:3000/add', (req, res, ctx) => {
		const { searchParams } = req.url;
		const a = searchParams.get('a');
		const b = searchParams.get('b');

		return res(
			ctx.json({
				c: Number(a) + Number(b)
			}),
			ctx.status(200),
		)
	}),

	rest.post('https://localhost:3000/add', (req, res, ctx) => {
		const { a, b } = JSON.parse(req.body as string) as { a: number, b: number };

		return res(
			ctx.json({
				c: a + b
			}),
			ctx.status(200),
		)
	}),

	rest.put('https://localhost:3000/add', (req, res, ctx) => {
		const { a, b } = JSON.parse(req.body as string) as { a: number, b: number };

		return res(
			ctx.json({
				c: a + b
			}),
			ctx.status(200),
		)
	}),

	rest.patch('https://localhost:3000/add', (req, res, ctx) => {
		const { a, b } = JSON.parse(req.body as string) as { a: number, b: number };

		return res(
			ctx.json({
				c: a + b
			}),
			ctx.status(200),
		)
	}),

	rest.delete('https://localhost:3000/remove', (req, res, ctx) => {
		return res (
			ctx.json({
				status: 'deleted'
			}),
			ctx.status(200),
		)
	}),

	rest.options('https://localhost:3000/check', (req, res, ctx) => {
		const accessHeader = req.headers.get('Access-Control-Allow-Origin');

		return res (
			ctx.set('Access-Control-Allow-Origin', accessHeader ?? ''),
			ctx.status(204),
		)
	}),
]

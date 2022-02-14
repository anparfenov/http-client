import { HttpNodeEngine, HttpClient } from 'http-client';

const client = new HttpClient({ engine: new HttpNodeEngine() });

async function main() {
	const res = await client.url('https://www.boredapi.com/api/activity').get();
	console.log('res', res);
}

main()

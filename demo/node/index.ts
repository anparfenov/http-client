import { HttpNodeEngine, HttpClient, HttpRequestBuilder } from 'http-client';

const client = new HttpClient({ engine: new HttpNodeEngine() });

async function main() {
	const request = new HttpRequestBuilder().url('https://www.boredapi.com/api/activity').get().build();
	const res = await client.send(request);
	console.log('res', res);
}

main()

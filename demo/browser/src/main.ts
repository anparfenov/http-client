import { HttpBrowserEngine, HttpClient, HttpRequestBuilder } from 'http-client';

const client = new HttpClient({ baseUrl: 'https://www.boredapi.com', engine: new HttpBrowserEngine() });

const button = document.querySelector('.js-submit');
const div = document.querySelector('.js-result');

button?.addEventListener('click', async () => {
	const request = new HttpRequestBuilder().url('/api/activity').get().build();
	const res = await client.send(request);
	const text = document.createTextNode(JSON.stringify(res));
	div?.append(text);
})

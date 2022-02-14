import { HttpBrowserEngine, HttpClient } from 'http-client';

const client = new HttpClient({ baseUrl: 'http://localhost:3000', engine: new HttpBrowserEngine() });

const button = document.querySelector('.js-submit');
const div = document.querySelector('.js-result');

button?.addEventListener('click', async () => {
    const res = await client.url('/test').get();
    console.log('res', res);
    const text = document.createTextNode(JSON.stringify(res));
    div?.append(text);
})

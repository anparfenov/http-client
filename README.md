# http-client

http client for browser and node. Use only with es modules.

## Installing

``` sh
npm i @asleeppiano/http-client
```

## Usage

- construct http client with browser or node engine
- build request using HttpRequestBuilder
- send request
- handle request result with isOk function

``` javascript
import { HttpClient, HttpNodeEngine, HttpRequestBuilder, isOk } from '@asleeppiano/http-client';


async function request() {
	const client = new HttpClient({ baseUrl: 'https://www.boredapi.com', engine: new HttpNodeEngine() });
	const request = new HttpRequestBuilder().url('/api/activity').get().build();
	const res = await client.send(request);
	if (isOk(res)) {
        console.log('res: ', res.result);
	} else {
		console.error(`Error. status = ${res.status}, message = ${res.message}`);
	}
}

request()
```

You can only send body as string for now.

## API

### HttpClient

#### Constructor

`HttpClient({ baseUrl: string, engine: HttpEngine })`

create http client with provided baseUrl and engine.

#### Methods

`send<R, B>(request: HttpRequest): ResponseResultPromise<R>` - send a builded request

`addOptions<R, B>(request: HttpRequest): ResponseResultPromise<R>` - add request options to all requests

### HttpEngine

#### Methods

`
request<T extends BodyInit, R>(
url: COMMON.Url,
requestOptions: RequestOptions,
data?: T,
): ResponseResultPromise<R>;
request<T, R>(
url: COMMON.Url,
requestOptions: RequestOptions,
data?: T,
): ResponseResultPromise<R>;
`

make request with provided url, request options, and some data.

### HttpRequestBuilder

`addOptions(options: HTTP.RequestOptionsProps): HttpRequestBuilder`
`body(body: TBody): HttpRequestBuilder`
`url(url: string): HttpRequestBuilder`
`query(query: TQuery): HttpRequestBuilder`
`headers(headers: Headers): HttpRequestBuilder`

add data to request

`get(): HttpRequestBuilder`
`head(): HttpRequestBuilder`
`post(): HttpRequestBuilder`
`put(): HttpRequestBuilder`
`patch(): HttpRequestBuilder`
`delete(): HttpRequestBuilder`
`options(): HttpRequestBuilder`

set a method

`build(): HTTP.HttpRequest`

returns HttpRequest

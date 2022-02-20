# http-client

http client for browser and node

## Installing

``` sh
npm i http-client
```

## Usage

- construct http client with browser or node engine
- build request using `url()` and `get()` methods
- send request
- handle request result with isOk function

``` javascript
import { HttpClient, HttpNodeClient, HttpRequestBuilder, isOk } from 'http-client';


async function request() {
	const client = new HttpClient({ baseUrl: 'https://www.boredapi.com', engine: new HttpNodeClient() });
	const request = new HttpRequestBuilder().url('/api/activity').get().build();
	const res = await client.send(request);
	if (isOk(res)) {
		return res.result.data;
	} else {
		console.error(`Error. status = ${res.status}, message = ${res.message}`);
	}
}

request();
```

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

import type { Either } from 'fp-ts/Either';
import { right, left } from 'fp-ts/Either';

import { HttpError } from './error';
import { ResponseType } from './common';

// TODO: maybe use it as singleton???
export class HttpBrowserEngine implements HTTP.HttpEngine {
    #adaptOptions(options: HTTP.RequestOptions): RequestInit {
        return {
            method: options.method ?? 'get',
            headers: options.headers
        }
    }

    #getContentType(headers: Headers): HTTP.ResponseType {
        const contentType = headers.get('content-type');
        if (contentType) {
            if (contentType.includes('application/json')) {
                return ResponseType.JSON;
            } else if (contentType.includes('text/plain')) {
                return ResponseType.TEXT;
            }
        }
        return ResponseType.TEXT;
    }

    #appendBody<T extends BodyInit>(options: RequestInit, body: T): RequestInit {
        return { ...options, body };
    }

    async request<T extends BodyInit, R>(
        url: COMMON.Url,
        requestOptions: HTTP.RequestOptions = { method: 'get' },
        data?: T,
    ): Promise<Either<Error, R>> {
        let adaptedOptions = this.#adaptOptions(requestOptions);
        if (data) {
            adaptedOptions = this.#appendBody(adaptedOptions, data);
        }
        try {
            const response = await fetch(url, adaptedOptions);
            const contentType = this.#getContentType(response.headers);
            const data = await response[contentType]();
            if (response.ok) {
                return right(data);
            }
            throw new HttpError({ status: response.status, message: response.statusText });
        } catch (e) {
            if (e instanceof HttpError) {
                return left(e);
            } else if (e instanceof Error) {
                return left(e);
            }
            else if (typeof e === 'string') {
                return left(new Error(e));
            }
            return left(new Error('unknown error'));
        }
    }
}

import https from 'node:https';
import http from 'node:http';

import type { Either } from 'fp-ts/Either';
import { right, left } from 'fp-ts/Either';

import { HttpError } from './error';
import { ResponseType } from './common';
import * as HTTP from '../types/http';
import * as COMMON from '../types/common';

function promisifiedRequest(url: any, options: any, data?: any) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, options, async (messageStream: http.IncomingMessage) => {
            messageStream.setEncoding('utf-8');
            try {
                if (messageStream.statusCode && messageStream.statusCode > 399) {
                    throw new HttpError({
                        status: messageStream.statusCode,
                        message: messageStream.statusMessage ?? 'error'
                    });
                }
                let responseType: HTTP.ResponseType  = ResponseType.TEXT;
                if (messageStream.headers['content-type'] === 'application/json') {
                    responseType = ResponseType.JSON;
                }
                let response = '';
                for await (let chunk of messageStream) {
                    response += chunk;
                }

                let result;
                if (responseType === ResponseType.JSON) {
                    result = JSON.parse(response);
                }
                resolve(result);
            } catch (e) {
                if (e instanceof HttpError) {
                    reject(e);
                } else if (e instanceof Error) {
                    reject(new HttpError({ status: 400, message: e.message }));
                } else if (typeof e === 'string') {
                    reject(new HttpError({ status: 400, message: e }));
                }
                reject(new HttpError({ status: 400, message: 'unknown error' }));
            }
        });
        if (data) {
            req.write(data);
        }
        req.end();
    });
}

export class HttpNodeEngine implements HTTP.HttpEngine {

    private adaptOptions(options: HTTP.RequestOptions): https.RequestOptions {
        return {
            method: options.method ?? 'get',
            headers: options.headers
        }
    }

    async request<T, R>(
        url: COMMON.Url,
        requestOptions: HTTP.RequestOptions = { method: 'get' },
        data?: T,
    ): Promise<Either<Error, R>> {
        const options = this.adaptOptions(requestOptions);
        try {
            const res = await promisifiedRequest(url, options, data);
            return right(res as R);
        } catch (e: unknown) {
            if (e instanceof HttpError) {
                return left(e);
            }
            if (e instanceof Error) {
                return left(e);
            }
            return left(new Error('unknown error'));
        }
    }
}

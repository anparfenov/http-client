import type { ResultPayload, Result, Ok, Failure } from '../types/http';

export enum ResponseType {
    TEXT = 'text',
    JSON = 'json'
}

export const makeOk = <TError, TData>(data: ResultPayload<TData>): Result<TError, TData> => ({ result: data, kind: 'ok' });
export const makeError = <TError, TData>(error: TError): Result<TError, TData> => ({ error, kind: 'failure' });

export const isOk = <TData>(result: Result<unknown, TData>): result is Ok<TData> => result.kind === 'ok';
export const isError = <TError>(result: Result<TError, unknown>): result is Failure<TError> => result.kind === 'failure';

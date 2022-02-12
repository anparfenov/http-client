import { isRight, isLeft } from 'fp-ts/Either';

export enum ResponseType {
    TEXT = 'text',
    JSON = 'json'
}

export const isOk = isRight;
export const isError = isLeft;

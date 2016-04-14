"use strict";

/*
    this is a thin wrapper around a Request that returns an array of objects in a promise
    these objects all implement a conversion interface
    
    the goal is to minimize repetitive boilerplate code when making API calls
*/

import * as Request from "request";

// a converter function is passed into the generic request function
// because the typescript compiler "erases" type information and we are
// unable to new() a generic type
export interface IConvertible <TResult> {
    (json: any): TResult;
}

const createOptionObject = (url: string, method: string, headers: {}, body: {}) => {
  let result = {url: url, method: method};
  if (headers !== "") result["headers"] = headers;
  if (body !== "") result["body"] = body;
  return result;
};

export function getDataAsync<TResult> (converter: IConvertible<TResult>, url: string, method: string, headers: {}, body: {}): Promise<Array<TResult>> {
    return new Promise<Array<TResult>> ((resolve, _) => {
        Request(createOptionObject(url, method, headers, body), (error, response, body) => {
            let results = new Array<TResult>();
            JSON.parse(body).data.forEach((item) => {
                results.push(converter(item));
            });
            resolve(results);
        });
    });
};

export function getDataAsyncSingle<TResult> (converter: IConvertible<TResult>, url: string, method: string, headers: {}, body: {}): Promise<TResult> {
    return new Promise<TResult> ((resolve, _) => {
        Request(createOptionObject(url, method, headers, body), (error, response, body) => {
            let result : TResult = converter(JSON.parse(body).data);
            resolve(result);
        });
    });
};
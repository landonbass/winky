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

// this function will create an option object that can contain a body and/or headers depending on the parameters
const createOptionObject = (url: string, method: string, headers: {}, body: {}) => {
  let result = {url: url, method: method};
  if (headers !== "") result["headers"] = headers;
  if (body !== "")    result["body"] = body;

  return result;
};

// simple typed wrapper to minimize boilerplate code when calling the wink api
export async function dataAsync<TResult> (converter: IConvertible<TResult>, url: string, method: string, headers: {}, body: {}): Promise<TResult> {
    return new Promise<TResult> ((resolve, _) => {
        Request(createOptionObject(url, method, headers, body), (error, response, body) => {
            let results : TResult = converter(JSON.parse(body).data);
            resolve(results);
        });
    });
};
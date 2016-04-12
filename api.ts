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

export function getDataAsync<TResult> (converter: IConvertible<TResult>, url: string, method: string, headers: {}): Promise<Array<TResult>> {
    return new Promise<Array<TResult>> ((resolve, _) => {
        Request({
            method: method,
            url:    url,
            headers: headers
        }, (error, response, body) => {
            let results = new Array<TResult>();
            JSON.parse(body).data.forEach((item) => {
                results.push(converter(item));
            });
            resolve(results);
        });
    });
};

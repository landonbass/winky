"use strict";
/*
    this is a thin wrapper around a Request that returns an array of objects in a promise
    these objects all implement a conversion interface
    
    the goal is to minimize repetitive boilerplate code when making API calls
*/
const Request = require("request");
const createOptionObject = (url, method, headers, body) => {
    let result = { url: url, method: method };
    if (headers !== "")
        result["headers"] = headers;
    if (body !== "")
        result["body"] = body;
    return result;
};
function getDataAsync(converter, url, method, headers, body) {
    return new Promise((resolve, _) => {
        Request(createOptionObject(url, method, headers, body), (error, response, body) => {
            let results = new Array();
            JSON.parse(body).data.forEach((item) => {
                results.push(converter(item));
            });
            resolve(results);
        });
    });
}
exports.getDataAsync = getDataAsync;
;
function getDataAsyncSingle(converter, url, method, headers, body) {
    return new Promise((resolve, _) => {
        Request(createOptionObject(url, method, headers, body), (error, response, body) => {
            let result = converter(JSON.parse(body).data);
            resolve(result);
        });
    });
}
exports.getDataAsyncSingle = getDataAsyncSingle;
;
//# sourceMappingURL=api.js.map
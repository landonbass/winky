"use strict";
/*
    this is a thin wrapper around a Request that returns an array of objects in a promise
    these objects all implement a conversion interface
    
    the goal is to minimize repetitive boilerplate code when making API calls
*/
const Request = require("request");
// this function will create an option object that can contain a body and/or headers depending on the parameters
const createOptionObject = (url, method, headers, body) => {
    let result = { url: url, method: method };
    if (headers !== "")
        result["headers"] = headers;
    if (body !== "")
        result["body"] = body;
    return result;
};
// simple typed wrapper to minimize boilerplate code when calling the wink api
function getDataAsync(converter, url, method, headers, body) {
    return new Promise((resolve, _) => {
        Request(createOptionObject(url, method, headers, body), (error, response, body) => {
            let results = converter(JSON.parse(body).data);
            resolve(results);
        });
    });
}
exports.getDataAsync = getDataAsync;
;
//# sourceMappingURL=api.js.map
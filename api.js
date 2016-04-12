"use strict";
/*
    this is a thin wrapper around a Request that returns an array of objects in a promise
    these objects all implement a conversion interface
    
    the goal is to minimize repetitive boilerplate code when making API calls
*/
const Request = require("request");
function getDataAsync(converter, url, method, headers) {
    return new Promise((resolve, _) => {
        Request({
            method: method,
            url: url,
            headers: headers
        }, (error, response, body) => {
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
//# sourceMappingURL=api.js.map
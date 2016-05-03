"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
/*
    this is a thin wrapper around a Request that returns an array of objects in a promise
    these objects all implement a conversion interface
    
    the goal is to minimize repetitive boilerplate code when making API calls
*/
var Request = require("request");
// this function will create an option object that can contain a body and/or headers depending on the parameters
var createOptionObject = function (url, method, headers, body) {
    var result = { url: url, method: method };
    if (headers !== "")
        result["headers"] = headers;
    if (body !== "")
        result["body"] = body;
    return result;
};
// simple typed wrapper to minimize boilerplate code when calling the wink api
function dataAsync(converter, url, method, headers, body) {
    return __awaiter(this, void 0, Promise, function* () {
        return new Promise(function (resolve, _) {
            Request(createOptionObject(url, method, headers, body), function (error, response, body) {
                var results = converter(JSON.parse(body).data);
                resolve(results);
            });
        });
    });
}
exports.dataAsync = dataAsync;
;

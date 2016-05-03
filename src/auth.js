"use strict";
var Api = require("./api");
var ReadlineSync = require("readline-sync");
;
;
exports.AuthConverter = function (json) {
    return ({ AccessToken: json.access_token, RefreshToken: json.refresh_token });
};
exports.authenticateAsync = function (options) {
    return Api.dataAsync(exports.AuthConverter, options.ApiUrl, "POST", { "Content-Type": "application/json" }, "{  \"client_id\": \"" + options.ClientId + "\",  \"client_secret\": \"" + options.ClientSecret + "\",  \"username\": \"" + options.UserName + "\",  \"password\": \"" + options.Password + "\",  \"grant_type\": \"password\"}");
};
exports.getTokens = function (config) {
    return new Promise(function (resolve, _) {
        console.log("tokens not found in config");
        var username = ReadlineSync.question("enter user name:");
        var password = ReadlineSync.question("enter password:", { hideEchoBack: true });
        var authOptions = { ApiUrl: config.ApiUrl, ClientId: config.ClientId, ClientSecret: config.ClientSecret, UserName: username, Password: password };
        exports.authenticateAsync(authOptions).then(function (results) {
            resolve(results);
        });
    });
};

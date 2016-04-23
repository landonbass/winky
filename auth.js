"use strict";
const Api = require("./api");
const Logger = require("./log");
const ReadlineSync = require("readline-sync");
;
;
exports.AuthConverter = function (json) {
    return ({ AccessToken: json.access_token, RefreshToken: json.refresh_token });
};
exports.authenticateAsync = (options) => {
    return Api.dataAsync(exports.AuthConverter, options.ApiUrl, "POST", { "Content-Type": "application/json" }, "{  \"client_id\": \"" + options.ClientId + "\",  \"client_secret\": \"" + options.ClientSecret + "\",  \"username\": \"" + options.UserName + "\",  \"password\": \"" + options.Password + "\",  \"grant_type\": \"password\"}");
};
exports.getTokens = (config) => {
    return new Promise((resolve, _) => {
        Logger.Log.Info("tokens not found in config");
        const username = ReadlineSync.question("enter user name:");
        const password = ReadlineSync.question("enter password:", { hideEchoBack: true });
        const authOptions = { ApiUrl: config.ApiUrl, ClientId: config.ClientId, ClientSecret: config.ClientSecret, UserName: username, Password: password };
        exports.authenticateAsync(authOptions).then((results) => {
            resolve(results);
        });
    });
};
//# sourceMappingURL=auth.js.map
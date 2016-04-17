"use strict";
const Api = require("./api");
const Logger = require("./log");
const Readline = require("readline");
;
;
exports.AuthConverter = function (json) {
    return ({ AccessToken: json.access_token, RefreshToken: json.refresh_token });
};
exports.authenticateAsync = (options) => {
    return Api.getDataAsyncSingle(exports.AuthConverter, options.ApiUrl, "POST", { "Content-Type": "application/json" }, "{  \"client_id\": \"" + options.ClientId + "\",  \"client_secret\": \"" + options.ClientSecret + "\",  \"username\": \"" + options.UserName + "\",  \"password\": \"" + options.Password + "\",  \"grant_type\": \"password\"}");
};
exports.getTokens = (config) => {
    return new Promise((resolve, _) => {
        const prompt = Readline.createInterface(process.stdin, process.stdout);
        let username, password = "";
        Logger.Log.Info("tokens not found in config");
        prompt.question("enter user name:", (result) => {
            username = result;
            prompt.question("enter password:", (result) => {
                password = result;
                prompt.close();
                const authOptions = { ApiUrl: config.ApiUrl, ClientId: config.ClientId, ClientSecret: config.ClientSecret, UserName: username, Password: password };
                exports.authenticateAsync(authOptions).then((results) => {
                    resolve(results);
                });
            });
        });
    });
};
//# sourceMappingURL=auth.js.map
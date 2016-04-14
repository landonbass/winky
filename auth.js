"use strict";
const Api = require("./api");
;
;
exports.AuthConverter = function (json) {
    return ({ AccessToken: json.access_token, RefreshToken: json.refresh_token });
};
exports.authenticateAync = (options) => {
    return Api.getDataAsyncSingle(exports.AuthConverter, options.ApiUrl, "POST", { "Content-Type": "application/json" }, "{  \"client_id\": \"" + options.ClientId + "\",  \"client_secret\": \"" + options.ClientSecret + "\",  \"username\": \"" + options.UserName + "\",  \"password\": \"" + options.Password + "\",  \"grant_type\": \"password\"}");
};
//# sourceMappingURL=auth.js.map
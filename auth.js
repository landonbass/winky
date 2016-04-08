"use strict";
const Request = require("request");
;
;
exports.authenticateAync = (options) => {
    return new Promise((resolve, _) => {
        Request({
            method: "POST",
            url: options.ApiUrl,
            headers: { "Content-Type": "application/json" },
            body: "{  \"client_id\": \"" + options.ClientId + "\",  \"client_secret\": \"" + options.ClientSecret + "\",  \"username\": \"" + options.UserName + "\",  \"password\": \"" + options.Password + "\",  \"grant_type\": \"password\"}"
        }, (error, response, body) => {
            const data = JSON.parse(body).data;
            resolve({ AccessToken: data.access_token, RefreshToken: data.refresh_token });
        });
    });
};
//# sourceMappingURL=auth.js.map
"use strict";
const Request = require("request");
;
exports.devicesAsync = (options) => {
    return new Promise((resolve, _) => {
        Request({
            method: "GET",
            url: "https://api.wink.com/users/me/wink_devices",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + options.AccessToken }
        }, (error, response, body) => {
            let devices = Array();
            JSON.parse(body).data.forEach((device) => {
                devices.push({ Name: device.name, Type: device.model_name });
            });
            resolve(devices);
        });
    });
};
//# sourceMappingURL=devices.js.map
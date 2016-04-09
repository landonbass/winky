"use strict";
const Request = require("request");
;
class Device {
    constructor() {
        this.toString = () => {
            return `${this.Name} - ${this.Type}`;
        };
    }
}
exports.Device = Device;
exports.devicesAsync = (options) => {
    return new Promise((resolve, _) => {
        Request({
            method: "GET",
            url: "https://api.wink.com/users/me/wink_devices",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + options.AccessToken }
        }, (error, response, body) => {
            let devices = Array();
            JSON.parse(body).data.forEach((device) => {
                const d = new Device();
                d.Name = device.name;
                d.Type = device.model_name;
                devices.push(d);
            });
            resolve(devices);
        });
    });
};
//# sourceMappingURL=devices.js.map
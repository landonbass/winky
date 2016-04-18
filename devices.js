"use strict";
const Api = require("./api");
;
class Device {
    constructor() {
        this.toString = () => {
            return `${this.Name} - ${this.Type}`;
        };
        this.ToDisplayArray = () => {
            const battery = isNaN(this.Battery) ? "" : (this.Battery) * 100 + "%";
            return [this.Name || "", this.Type || "", battery];
        };
    }
}
exports.Device = Device;
exports.DeviceConverter = function (json) {
    const devices = new Array();
    json.forEach((d) => {
        const device = new Device();
        device.Name = d.name;
        device.Type = d.model_name;
        device.Battery = d.last_reading.battery;
        devices.push(device);
    });
    return devices;
};
exports.devicesAsync = (options) => {
    return Api.getDataAsync(exports.DeviceConverter, "https://api.wink.com/users/me/wink_devices", "GET", { "Content-Type": "application/json", "Authorization": "Bearer " + options.AccessToken }, "");
};
//# sourceMappingURL=devices.js.map
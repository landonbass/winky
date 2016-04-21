"use strict";
const Api = require("./api");
(function (DeviceType) {
    DeviceType[DeviceType["GarageDoor"] = 0] = "GarageDoor";
    DeviceType[DeviceType["Hub"] = 1] = "Hub";
    DeviceType[DeviceType["Key"] = 2] = "Key";
    DeviceType[DeviceType["LightBulb"] = 3] = "LightBulb";
    DeviceType[DeviceType["Lock"] = 4] = "Lock";
    DeviceType[DeviceType["SensorPod"] = 5] = "SensorPod";
    DeviceType[DeviceType["Thermostat"] = 6] = "Thermostat";
    DeviceType[DeviceType["Unknown"] = 7] = "Unknown";
})(exports.DeviceType || (exports.DeviceType = {}));
var DeviceType = exports.DeviceType;
;
;
class Device {
    constructor() {
        this.toString = () => {
            return `${this.Name} - ${this.Model}`;
        };
        this.ToDisplayArray = () => {
            const battery = isNaN(this.Battery) ? "" : (this.Battery) * 100 + "%";
            return [this.Name || "", DeviceType[this.Type] || "", this.Model || "", battery];
        };
    }
}
exports.Device = Device;
exports.DeviceConverter = function (json) {
    const devices = new Array();
    json.forEach((d) => {
        const device = new Device();
        device.Id = d.object_id;
        device.Name = d.name;
        device.Type = getDeviceType(d);
        device.Model = d.model_name;
        device.Battery = d.last_reading.battery;
        devices.push(device);
    });
    return devices;
};
const getDeviceType = (device) => {
    if (device.hasOwnProperty("garage_door_id"))
        return DeviceType.GarageDoor;
    if (device.hasOwnProperty("key_id"))
        return DeviceType.Key;
    if (device.hasOwnProperty("light_bulb_id"))
        return DeviceType.LightBulb;
    if (device.hasOwnProperty("lock_id"))
        return DeviceType.Lock;
    if (device.hasOwnProperty("sensor_pod_id"))
        return DeviceType.SensorPod;
    if (device.hasOwnProperty("thermostat_id"))
        return DeviceType.Thermostat;
    return DeviceType.Hub;
};
exports.devicesAsync = (options) => {
    return Api.getDataAsync(exports.DeviceConverter, "https://api.wink.com/users/me/wink_devices", "GET", { "Content-Type": "application/json", "Authorization": "Bearer " + options.AccessToken }, "");
};
//export const setDeviceState = (options: Auth.IAuthResult, deviceId: string, state: string) : Promise< 
//# sourceMappingURL=devices.js.map
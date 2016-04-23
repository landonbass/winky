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
(function (DeviceStatus) {
    DeviceStatus[DeviceStatus["Off"] = 0] = "Off";
    DeviceStatus[DeviceStatus["On"] = 1] = "On";
    DeviceStatus[DeviceStatus["Unknown"] = 2] = "Unknown";
})(exports.DeviceStatus || (exports.DeviceStatus = {}));
var DeviceStatus = exports.DeviceStatus;
;
;
class Device {
    constructor() {
        this.toString = () => {
            return `${this.Name} - ${this.Model}`;
        };
        this.ToDisplayArray = () => {
            const battery = isNaN(this.Battery) ? "" : (this.Battery) * 100 + "%";
            return [this.Name || "", DeviceType[this.Identifier.Type] || "", DeviceStatus[this.Status] || "", battery];
        };
    }
}
exports.Device = Device;
exports.DeviceConverter = function (json) {
    const devices = new Array();
    json.forEach((d) => {
        const device = new Device();
        device.Identifier = getDeviceIdentifier(d);
        device.Status = getDeviceStatus(d);
        device.Id = device.Identifier.Id;
        device.Name = d.name;
        device.Model = d.model_name;
        device.Battery = d.last_reading.battery;
        devices.push(device);
    });
    return devices;
};
const getDeviceIdentifier = (device) => {
    if (device.hasOwnProperty("garage_door_id"))
        return { Id: device.garage_door_id, IdPropertyName: "garage_door_id", Type: DeviceType.GarageDoor };
    if (device.hasOwnProperty("key_id"))
        return { Id: device.key_id, IdPropertyName: "key_id", Type: DeviceType.Key };
    if (device.hasOwnProperty("light_bulb_id"))
        return { Id: device.light_bulb_id, IdPropertyName: "light_bulb_id", Type: DeviceType.LightBulb };
    if (device.hasOwnProperty("lock_id"))
        return { Id: device.lock_id, IdPropertyName: "lock_id", Type: DeviceType.Lock };
    if (device.hasOwnProperty("sensor_pod_id"))
        return { Id: device.sensor_pod_id, IdPropertyName: "sensor_pod_id", Type: DeviceType.SensorPod };
    if (device.hasOwnProperty("thermostat_id"))
        return { Id: device.thermostat_id, IdPropertyName: "thermostat_id", Type: DeviceType.Thermostat };
    return { Id: device.hub_id, IdPropertyName: "hub_id", Type: DeviceType.Hub };
};
const getDeviceStatus = (device) => {
    if (device.hasOwnProperty("light_bulb_id"))
        return device.last_reading.powered ? DeviceStatus.On : DeviceStatus.Off;
    //if (device.hasOwnProperty("key_id"))          return {Id: device.key_id,          IdPropertyName: "key_id",           Type: DeviceType.Key};
    //if (device.hasOwnProperty("light_bulb_id"))   return {Id: device.light_bulb_id,   IdPropertyName: "light_bulb_id",    Type: DeviceType.LightBulb};
    //if (device.hasOwnProperty("lock_id"))         return {Id: device.lock_id,         IdPropertyName: "lock_id",          Type: DeviceType.Lock};
    //if (device.hasOwnProperty("sensor_pod_id"))   return {Id: device.sensor_pod_id,   IdPropertyName: "sensor_pod_id",    Type: DeviceType.SensorPod};
    //if (device.hasOwnProperty("thermostat_id"))   return {Id: device.thermostat_id,   IdPropertyName: "thermostat_id",    Type: DeviceType.Thermostat};
    //return {Id: device.hub_id, IdPropertyName: "hub_id", Type: DeviceType.Hub};
    // TODO handle other device types
    return DeviceStatus.Unknown;
};
const convertDeviceTypeToUrlType = (type) => {
    if (type === DeviceType.LightBulb)
        return "light_bulbs";
    return "";
};
const noop = () => { };
exports.devicesAsync = (options) => {
    return Api.dataAsync(exports.DeviceConverter, "https://api.wink.com/users/me/wink_devices", "GET", { "Content-Type": "application/json", "Authorization": "Bearer " + options.AccessToken }, "");
};
exports.setDeviceState = (options, deviceType, deviceId, state) => {
    return Api.dataAsync(noop, `https://api.wink.com/${convertDeviceTypeToUrlType(deviceType)}/${deviceId}`, "PUT", { "Content-Type": "application/json", "Authorization": "Bearer " + options.AccessToken }, state);
};
exports.toggleDeviceState = (options, device) => {
    let state = "";
    if (device.Identifier.Type === DeviceType.LightBulb) {
        const newStatus = device.Status === DeviceStatus.On ? false : true;
        state = `{"desired_state":{"powered":${newStatus}}}`;
    }
    return exports.setDeviceState(options, device.Identifier.Type, device.Id, state);
};
//# sourceMappingURL=devices.js.map
"use strict";

import * as Api     from "./api";
import * as Auth    from "./auth";
import * as Ui      from "./ui";
import * as Utility from "./utility";

export enum DeviceType {GarageDoor, Hub, Key, LightBulb, Lock, SensorPod, Thermostat, Unknown};

export enum DeviceStatus {Off, On, Unknown, NA}

export interface DeviceIdentifier {Id: string; IdPropertyName:string; Type: DeviceType; };

export interface IDevice {Id: string; Identifier: DeviceIdentifier; Status: DeviceStatus; Name: string; Model: string; Battery: number; };

export class Device implements IDevice, Ui.IDisplayFormatter {
    public Id         : string;
    public Status     : DeviceStatus;
    public Identifier : DeviceIdentifier;
    public Name       : string;
    public Model      : string;
    public Battery    : number;
    public toString = () : string => {
        return `${this.Name} - ${this.Model}`;
    };
    public ToDisplayArray = () : Array<string> => {
      const battery = isNaN(this.Battery) ? "" : (this.Battery) * 100 + "%";
      return [this.Name || "", DeviceType[this.Identifier.Type] || "", DeviceStatus[this.Status] || "", battery];
    };
}

export const DeviceConverter: Api.IConvertible<Array<Device>>  = function (json) {
    const devices = new Array<Device>();
    json.forEach((d) => {
        devices.push(ParseDeviceFromJson(d));
    });
    return devices;
};

const ParseDeviceFromJson = (json: Object) : Device => {
    const device      = new Device();
    device.Identifier = getDeviceIdentifier(json);
    device.Status     = getDeviceStatus(json);
    device.Id         = device.Identifier.Id;
    device.Name       = json["name"];
    device.Model      = json["model_name"];
    device.Battery    = json["last_reading.battery"];
    return device;
}

const getDeviceIdentifier = (device: any) : DeviceIdentifier => {
  if (device.hasOwnProperty("garage_door_id"))  return {Id: device.garage_door_id,  IdPropertyName: "garage_door_id",   Type: DeviceType.GarageDoor};
  if (device.hasOwnProperty("key_id"))          return {Id: device.key_id,          IdPropertyName: "key_id",           Type: DeviceType.Key};
  if (device.hasOwnProperty("light_bulb_id"))   return {Id: device.light_bulb_id,   IdPropertyName: "light_bulb_id",    Type: DeviceType.LightBulb};
  if (device.hasOwnProperty("lock_id"))         return {Id: device.lock_id,         IdPropertyName: "lock_id",          Type: DeviceType.Lock};
  if (device.hasOwnProperty("sensor_pod_id"))   return {Id: device.sensor_pod_id,   IdPropertyName: "sensor_pod_id",    Type: DeviceType.SensorPod};
  if (device.hasOwnProperty("thermostat_id"))   return {Id: device.thermostat_id,   IdPropertyName: "thermostat_id",    Type: DeviceType.Thermostat};
  return {Id: device.hub_id, IdPropertyName: "hub_id", Type: DeviceType.Hub};
};

const getDeviceStatus = (device: any) : DeviceStatus => {
  if (device.hasOwnProperty("light_bulb_id"))  return device.last_reading.powered ? DeviceStatus.On : DeviceStatus.Off;
  if (device.hasOwnProperty("key_id"))         return DeviceStatus.NA;
  //if (device.hasOwnProperty("light_bulb_id"))   return {Id: device.light_bulb_id,   IdPropertyName: "light_bulb_id",    Type: DeviceType.LightBulb};
  //if (device.hasOwnProperty("lock_id"))         return {Id: device.lock_id,         IdPropertyName: "lock_id",          Type: DeviceType.Lock};
  //if (device.hasOwnProperty("sensor_pod_id"))   return {Id: device.sensor_pod_id,   IdPropertyName: "sensor_pod_id",    Type: DeviceType.SensorPod};
  //if (device.hasOwnProperty("thermostat_id"))   return {Id: device.thermostat_id,   IdPropertyName: "thermostat_id",    Type: DeviceType.Thermostat};
  //return {Id: device.hub_id, IdPropertyName: "hub_id", Type: DeviceType.Hub};
  
  return device.last_reading.connection ? DeviceStatus.On : DeviceStatus.Off;
};

// map device types to wink url
const convertDeviceTypeToUrlType = (type: DeviceType) : string => {
    switch (type) {
        case DeviceType.LightBulb: return "light_bulbs";
        default:                   return "";
    }
}

// generate swap state json for supported devices
const generateSwapStateJson = (device: Device) : string => {
    let state = "";
    if (device.Identifier.Type === DeviceType.LightBulb) {
        const newStatus = device.Status === DeviceStatus.On ? false : true;
        state = `{"desired_state":{"powered":${newStatus}}}`;
    }  
    return state;
};

const setDeviceState = (options: Auth.IAuthResult, deviceType: DeviceType, deviceId: string, state: string) : Promise<void> => {
    return Api.dataAsync<void>(Utility.noop, `https://api.wink.com/${convertDeviceTypeToUrlType(deviceType)}/${deviceId}`, "PUT", {"Content-Type": "application/json", "Authorization" : "Bearer " + options.AccessToken}, state);
};

export const devicesAsync = (options: Auth.IAuthResult) : Promise<Array<Device>> => {
    return Api.dataAsync<Array<Device>>(DeviceConverter, "https://api.wink.com/users/me/wink_devices", "GET", {"Content-Type": "application/json", "Authorization" : "Bearer " + options.AccessToken}, "");
};

export const toggleDeviceState = (options: Auth.IAuthResult, device: Device) : Promise <void> => {
    // currently only work for lights
    if (device.Identifier.Type !== DeviceType.LightBulb) return;
    return setDeviceState(options, device.Identifier.Type, device.Id, generateSwapStateJson(device));
}
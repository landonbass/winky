"use strict";

import * as Api     from "./api";
import * as Auth    from "./auth";
import * as Request from "request";
import * as Ui      from "./ui";

export enum DeviceType {GarageDoor, Hub, Key, LightBulb, Lock, SensorPod, Thermostat, Unknown};

export interface DeviceIdentifier {Id: string; IdPropertyName:string; Type: DeviceType; };

export interface IDevice {Identifier: DeviceIdentifier; Name: string; Model: string; Battery: number; };

export class Device implements IDevice, Ui.IDisplayFormatter {
    public Identifier: DeviceIdentifier;
    public Name:       string;
    public Model:      string;
    public Battery:    number;
    public toString = () : string => {
        return `${this.Name} - ${this.Model}`;
    };
    public ToDisplayArray = () : Array<string> => {
      const battery = isNaN(this.Battery) ? "" : (this.Battery) * 100 + "%";
      return [this.Name || "", DeviceType[this.Identifier.Type] || "", this.Model || "", battery];
    };
}

export const DeviceConverter: Api.IConvertible<Array<Device>>  = function (json) {
    const devices = new Array<Device>();
    json.forEach((d) => {
        const device      = new Device();
        device.Identifier = getDeviceIdentifier(d);
        device.Name       = d.name;
        device.Model      = d.model_name;
        device.Battery    = d.last_reading.battery;
        devices.push(device);
    });
    return devices;
};

const getDeviceIdentifier = (device: any) : DeviceIdentifier => {
  if (device.hasOwnProperty("garage_door_id"))  return {Id: device.garage_door_id,  IdPropertyName: "garage_door_id",   Type: DeviceType.GarageDoor};
  if (device.hasOwnProperty("key_id"))          return {Id: device.key_id,          IdPropertyName: "key_id",           Type: DeviceType.Key};
  if (device.hasOwnProperty("light_bulb_id"))   return {Id: device.light_bulb_id,   IdPropertyName: "light_bulb_id",    Type: DeviceType.LightBulb};
  if (device.hasOwnProperty("lock_id"))         return {Id: device.lock_id,         IdPropertyName: "lock_id",          Type: DeviceType.Lock};
  if (device.hasOwnProperty("sensor_pod_id"))   return {Id: device.sensor_pod_id,   IdPropertyName: "sensor_pod_id",    Type: DeviceType.SensorPod};
  if (device.hasOwnProperty("thermostat_id"))   return {Id: device.thermostat_id,   IdPropertyName: "thermostat_id",    Type: DeviceType.Thermostat};
  return {Id: device.hub_id, IdPropertyName: "hub_id", Type: DeviceType.Hub};
};

export const devicesAsync = (options: Auth.IAuthResult) : Promise<Array<Device>> => {
    return Api.getDataAsync<Array<Device>>(DeviceConverter, "https://api.wink.com/users/me/wink_devices", "GET", {"Content-Type": "application/json", "Authorization" : "Bearer " + options.AccessToken}, "");
};

//export const setDeviceState = (options: Auth.IAuthResult, deviceId: string, state: string) : Promise<
"use strict";

import * as Api     from "./api";
import * as Auth    from "./auth";
import * as Request from "request";
import * as Ui      from "./ui";

export enum DeviceType {GarageDoor, Hub, Key, LightBulb, Lock, SensorPod, Thermostat, Unknown};

export interface IDevice {Id: string; Name: string; Type: DeviceType; Model: string; Battery: number; };

export class Device implements IDevice, Ui.IDisplayFormatter {
    public Id:      string;
    public Name:    string;
    public Type:    DeviceType;
    public Model:   string;
    public Battery: number;
    public toString = () : string => {
        return `${this.Name} - ${this.Model}`;
    };
    public ToDisplayArray = () : Array<string> => {
      const battery = isNaN(this.Battery) ? "" : (this.Battery) * 100 + "%";
      return [this.Name || "", DeviceType[this.Type] || "", this.Model || "", battery];
    };
}

export const DeviceConverter: Api.IConvertible<Array<Device>>  = function (json) {
    const devices = new Array<Device>();
    json.forEach((d) => {
        const device   = new Device();
        device.Id      = d.object_id;
        device.Name    = d.name;
        device.Type    = getDeviceType(d);
        device.Model   = d.model_name;
        device.Battery = d.last_reading.battery;
        devices.push(device);
    });
    return devices;
};

const getDeviceType = (device: any) : DeviceType => {
  if (device.hasOwnProperty("garage_door_id"))   return DeviceType.GarageDoor;
  if (device.hasOwnProperty("key_id"))          return DeviceType.Key;
  if (device.hasOwnProperty("light_bulb_id"))   return DeviceType.LightBulb;
  if (device.hasOwnProperty("lock_id"))         return DeviceType.Lock;
  if (device.hasOwnProperty("sensor_pod_id"))   return DeviceType.SensorPod;
  if (device.hasOwnProperty("thermostat_id"))   return DeviceType.Thermostat;
  return DeviceType.Hub;
};

export const devicesAsync = (options: Auth.IAuthResult) : Promise<Array<Device>> => {
    return Api.getDataAsync<Array<Device>>(DeviceConverter, "https://api.wink.com/users/me/wink_devices", "GET", {"Content-Type": "application/json", "Authorization" : "Bearer " + options.AccessToken}, "");
};

//export const setDeviceState = (options: Auth.IAuthResult, deviceId: string, state: string) : Promise<
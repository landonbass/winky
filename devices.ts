"use strict";

import * as Api     from "./api";
import * as Auth    from "./auth";
import * as Request from "request";
import * as Ui      from "./ui";

export interface IDevice {Name: string; Type: string; Battery: number; };

export class Device implements IDevice, Ui.IDisplayFormatter {
    public Name:    string;
    public Type:    string;
    public Battery: number;
    public toString = () : string => {
        return `${this.Name} - ${this.Type}`;
    };
    public ToDisplayArray = () : Array<string> => {
      const battery = isNaN(this.Battery) ? "" : (this.Battery) * 100 + "%";
      return [this.Name || "", this.Type || "", battery];
    };
}

export const DeviceConverter: Api.IConvertible<Array<Device>>  = function (json) {
    const devices = new Array<Device>();
    json.forEach((d) => {
        const device = new Device();
        device.Name = d.name;
        device.Type = d.model_name;
        device.Battery = d.last_reading.battery;
        devices.push(device);
    });
    return devices;
};

export const devicesAsync = (options: Auth.IAuthResult) : Promise<Array<Device>> => {
    return Api.getDataAsync<Array<Device>>(DeviceConverter, "https://api.wink.com/users/me/wink_devices", "GET", {"Content-Type": "application/json", "Authorization" : "Bearer " + options.AccessToken}, "");
};

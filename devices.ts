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

export const DeviceConverter: Api.IConvertible<Device>  = function (json) {
    const d = new Device();
    d.Name = json.name;
    d.Type = json.model_name;
    d.Battery = json.last_reading.battery;
    return d;
};

export const devicesAsync = (options: Auth.IAuthResult) : Promise<Array<Device>> => {
    return Api.getDataAsync<Device>(DeviceConverter, "https://api.wink.com/users/me/wink_devices", "GET", {"Content-Type": "application/json", "Authorization" : "Bearer " + options.AccessToken}, "");
};

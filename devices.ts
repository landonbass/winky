"use strict";


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
    }
    public ToDisplayArray = () : Array<string> => {
      const battery = isNaN(this.Battery) ? "" : (this.Battery) * 100 + "%";
      return [this.Name || "", this.Type || "", battery];
    };
}

export const devicesAsync = (options: Auth.IAuthResult) => {
    return new Promise<Array<Device>>( (resolve, _) => {
        Request({
            method: "GET",
            url: "https://api.wink.com/users/me/wink_devices",
            headers: {"Content-Type": "application/json", "Authorization" : "Bearer " + options.AccessToken}
        }, (error, response, body) => {
            let devices = Array<Device>();
            JSON.parse(body).data.forEach((device) => {
                const d = new Device();
                d.Name = device.name;
                d.Type = device.model_name;
                d.Battery = device.last_reading.battery;
                devices.push(d);
            });
            devices.sort();
            resolve(devices);
        });
    });
};
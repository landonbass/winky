"use strict";

import * as Request from "request";
import * as Auth from "./auth";


export interface IDevice {Name: string; Type: string; };

export class Device implements IDevice {
    public Name: string;
    public Type: string;
    
    public toString = () : string => {
        return `${this.Name} - ${this.Type}`
    }
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
                devices.push(d);
            });
            resolve(devices);
        });
    });
};
"use strict";

import * as Request from "request";
import * as Auth from "./auth";


export interface IDevice {Name: string; Type: string; };

export const devicesAsync = (options: Auth.IAuthResult) => {
    return new Promise<Array<IDevice>>( (resolve, _) => {
        Request({
            method: "GET",
            url: "https://api.wink.com/users/me/wink_devices",
            headers: {"Content-Type": "application/json", "Authorization" : "Bearer " + options.AccessToken}
        }, (error, response, body) => {
            let devices = Array<IDevice>();
            JSON.parse(body).data.forEach((device) => {
                devices.push({Name: device.name, Type: device.model_name});
            });
            resolve(devices);
        });
    });
};
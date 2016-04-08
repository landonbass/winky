"use strict";

/// <reference path="typings/node/node.d.ts" />
/// <reference path="typings/main/definitions/request.d.ts" />
/// <reference path='node_modules/promise-ts/promise-ts.d.ts'/>

import * as Request from "request";
import * as Auth from "./auth";
import * as Device from "./devices"

const
    options = {
        apiUrl       : "https://api.wink.com/oauth2/token",
        userName     : "",
        password     : "",
        clientId     : "quirky_wink_android_app",
        clientSecret : "e749124ad386a5a35c0ab554a4f2c045",
    };

async function init() {
    const authOptions: Auth.IAuthOptions = {ApiUrl: options.apiUrl, UserName: options.userName, Password: options.password, ClientId: options.clientId, ClientSecret: options.clientSecret };
    const authTokens : Auth.IAuthResult  = await Auth.authenticateAync(authOptions);
    const devices    : Array<Device.IDevice>  = await Device.devicesAsync(authTokens);
    console.log(devices);
    
    return 1;
};

init();


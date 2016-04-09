"use strict";

import * as Logger  from "./log";
import * as Config  from "./config";
import * as Auth    from "./auth";
import * as Devices from "./devices";
import * as Robots  from "./robots";
import * as UI      from "./ui";


async function init() {
    Logger.Log.Info("starting process");
    const authOptions: Auth.IAuthOptions = {ApiUrl: Config.data.ApiUrl, UserName: Config.data.UserName, Password: Config.data.Password, ClientId: Config.data.ClientId, ClientSecret: Config.data.ClientSecret };
    
    const authTokens : Auth.IAuthResult  = await Auth.authenticateAync(authOptions);
    
    const devices    : Array<Devices.Device>  = await Devices.devicesAsync(authTokens);
    const robots     : Array<Robots.Robot> = await Robots.robotsAsync(authTokens);

    UI.Setup(devices, robots);
    return 1;
};

init();


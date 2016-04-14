"use strict";

import * as Logger  from "./log";
import * as Config  from "./config";
import * as Auth    from "./auth";
import * as Devices from "./devices";
import * as Robots  from "./robots";
import * as UI      from "./ui";

// bootstrap console output until ui is provisioned
const consoleLogger = (message) => {
    console.log(message);
};
Logger.logEmitter.addListener("log", consoleLogger);
Logger.Log.Info("initialized console logger");

async function init() {
    Logger.Log.Info("requestion authorization and refresh tokens");
    const authOptions: Auth.IAuthOptions = {ApiUrl: Config.data.ApiUrl, UserName: Config.data.UserName, Password: Config.data.Password, ClientId: Config.data.ClientId, ClientSecret: Config.data.ClientSecret };
    const authTokens : Auth.IAuthResult  = await Auth.authenticateAync(authOptions);
    Logger.Log.Info("access token received: " + authTokens.AccessToken);
    UI.Setup(authTokens);
    return 1;
};

init();


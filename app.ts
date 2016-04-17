"use strict";

import * as Auth     from "./auth";
import * as Config   from "./config";
import * as Logger   from "./log";
import * as UI       from "./ui";

// bootstrap console output until ui is provisioned
const consoleLogger = (message) => {
    console.log(message);
};
Logger.logEmitter.addListener("log", consoleLogger);
Logger.Log.Info("initialized console logger");

async function init() {
    const config = await Config.data();
    if (config.AccessToken === "" || config.RefreshToken === "") {
        const authTokens: Auth.IAuthResult = await Auth.getTokens(config);
        await Config.updateTokens(authTokens.AccessToken, authTokens.RefreshToken);
        config.AccessToken = authTokens.AccessToken;
        config.RefreshToken = authTokens.RefreshToken;
        Logger.Log.Info(`obtained access token: ${authTokens.AccessToken}`);
    }
    const authTokens: Auth.IAuthResult = {AccessToken: config.AccessToken, RefreshToken: config.RefreshToken};
    UI.Setup(authTokens);
    return 1;
};

init();


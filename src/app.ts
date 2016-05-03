"use strict";

import * as Auth     from "./auth";
import * as Config   from "./config";
import * as UI       from "./ui";


// this is the main entry point to the application
// it validates that it has tokens and then provisions the UI
async function init() {
    const config = await Config.data();
    if (config.AccessToken === "" || config.RefreshToken === "") {
        const authTokens: Auth.IAuthResult = await Auth.getTokens(config);
        await Config.updateTokens(authTokens.AccessToken, authTokens.RefreshToken);
        config.AccessToken = authTokens.AccessToken;
        config.RefreshToken = authTokens.RefreshToken;
    }
    const authTokens: Auth.IAuthResult = {AccessToken: config.AccessToken, RefreshToken: config.RefreshToken};
    UI.Setup(authTokens);
    return 1;
};

init();
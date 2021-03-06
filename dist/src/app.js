"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const Auth = require("./auth");
const Config = require("./config");
const UI = require("./ui");
const Utility = require("./utility");
// this is the main entry point to the application
// it validates that it has tokens and then provisions the UI
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const config = yield Config.data();
        if (Utility.isNullUndefinedEmpty(config.AccessToken) || Utility.isNullUndefinedEmpty(config.RefreshToken)) {
            const authTokens = yield Auth.getTokens(config);
            yield Config.updateTokens(authTokens.AccessToken, authTokens.RefreshToken);
            config.AccessToken = authTokens.AccessToken;
            config.RefreshToken = authTokens.RefreshToken;
        }
        const authTokens = { AccessToken: config.AccessToken, RefreshToken: config.RefreshToken };
        UI.Setup(authTokens);
        return 1;
    });
}
;
init();
//# sourceMappingURL=app.js.map
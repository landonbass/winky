"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const Logger = require("./log");
const Config = require("./config");
const Auth = require("./auth");
const Devices = require("./devices");
const UI = require("./ui");
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        Logger.Log.Info("starting process");
        const authOptions = { ApiUrl: Config.data.ApiUrl, UserName: Config.data.UserName, Password: Config.data.Password, ClientId: Config.data.ClientId, ClientSecret: Config.data.ClientSecret };
        const authTokens = yield Auth.authenticateAync(authOptions);
        const devices = yield Devices.devicesAsync(authTokens);
        return devices;
    });
}
;
init().then((devices) => {
    UI.Setup(devices);
});
//# sourceMappingURL=server.js.map
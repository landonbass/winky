"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const Async = require("async");
const Logger = require("./log");
const Config = require("./config");
const Auth = require("./auth");
const Devices = require("./devices");
const Robots = require("./robots");
const UI = require("./ui");
// bootstrap console output until ui is provisioned
const consoleLogger = (message) => {
    console.log(message);
};
Logger.logEmitter.addListener("log", consoleLogger);
Logger.Log.Info("initialized console logger");
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        Logger.Log.Info("requestion authorization and refresh tokens");
        const authOptions = { ApiUrl: Config.data.ApiUrl, UserName: Config.data.UserName, Password: Config.data.Password, ClientId: Config.data.ClientId, ClientSecret: Config.data.ClientSecret };
        const authTokens = yield Auth.authenticateAync(authOptions);
        Logger.Log.Info("access token received: " + authTokens.AccessToken);
        Async.parallel([
                (cb) => __awaiter(this, void 0, void 0, function* () {
                Devices.devicesAsync(authTokens).then((devices) => {
                    cb(null, devices);
                });
            }),
                (cb) => __awaiter(this, void 0, void 0, function* () {
                Robots.robotsAsync(authTokens).then((robots) => {
                    cb(null, robots);
                });
            })
        ], (err, results) => {
            // transitioning to UI, remove consoleLogger
            Logger.Log.Info("transitioning to UI mode, removing console log hook");
            Logger.logEmitter.removeListener("log", consoleLogger);
            UI.Setup(authTokens, results[0], results[1]);
        });
        return 1;
    });
}
;
init();
//# sourceMappingURL=server.js.map
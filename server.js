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
const Device = require("./devices");
const options = {
    apiUrl: "https://api.wink.com/oauth2/token",
    userName: "",
    password: "",
    clientId: "quirky_wink_android_app",
    clientSecret: "e749124ad386a5a35c0ab554a4f2c045",
};
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const authOptions = { ApiUrl: options.apiUrl, UserName: options.userName, Password: options.password, ClientId: options.clientId, ClientSecret: options.clientSecret };
        const authTokens = yield Auth.authenticateAync(authOptions);
        const devices = yield Device.devicesAsync(authTokens);
        console.log(devices);
        return 1;
    });
}
;
init();
//# sourceMappingURL=server.js.map
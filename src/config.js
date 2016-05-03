"use strict";
var Fs = require("fs");
var Logger = require("./log");
var Path = require("path");
// all config data stored in a config.json file, which is not tracked in git
// the application does not store username or password, instead it uses the wink api
// to get the needed oauth tokens and store those
var configPath = Path.join(__dirname, "..", "config.json");
// TODO get real client id and secret
var defaultConfig = { ApiUrl: "https://api.wink.com/oauth2/token", ClientId: "quirky_wink_android_app", ClientSecret: "e749124ad386a5a35c0ab554a4f2c045", AccessToken: "", RefreshToken: "" };
;
// returns the config values, creating a new file if needed
exports.data = function () {
    return new Promise(function (resolve, _) {
        Fs.readFile(configPath, "UTF-8", function (err, data) {
            // if the config file is not found, create a new one with blank tokens
            if (err) {
                Logger.Log.Warn("config file not found, creating default...");
                Fs.writeFile(configPath, JSON.stringify(defaultConfig), function (err) {
                    resolve(defaultConfig);
                });
            }
            else {
                var config = JSON.parse(data);
                resolve(config);
            }
        });
    });
};
// update the auth tokens in the config
exports.updateTokens = function (authToken, refreshToken) {
    return new Promise(function (resolve, _) {
        exports.data().then(function (config) {
            config.AccessToken = authToken;
            config.RefreshToken = refreshToken;
            Fs.writeFile(configPath, JSON.stringify(config), function (err) {
                Logger.Log.Warn("updated tokens in config file...");
                resolve(true);
            });
        });
    });
};

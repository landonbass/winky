"use strict";

import * as Fs     from "fs";
import * as Logger from "./log";

// all config data stored in a config.json file, which is not tracked in git
// the application does not store username or password, instead it uses the wink api
// to get the needed oauth tokens and store those
const configPath = "../config.json";
// TODO get real client id and secret
const defaultConfig = {ApiUrl: "https://api.wink.com/oauth2/token", ClientId: "quirky_wink_android_app", ClientSecret: "e749124ad386a5a35c0ab554a4f2c045", AccessToken: "", RefreshToken: ""};
   
export interface IConfig {ApiUrl: string; ClientId: string; ClientSecret: string; AccessToken: string; RefreshToken: string; };

// returns the config values, creating a new file if needed
export const data = () : Promise<IConfig> => {
    return new Promise<IConfig> ((resolve, _) => {
        Fs.readFile(configPath, "UTF-8", (err, data) => {
            // if the config file is not found, create a new one with blank tokens
            if (err) {
                Logger.Log.Warn("config file not found, creating default...");
                Fs.writeFile(configPath, JSON.stringify(defaultConfig), (err) => {
                    resolve(defaultConfig);
                });
            } else {
                const config = JSON.parse(data);
                resolve(config);
            }
        });
    });
};

// update the auth tokens in the config
export const updateTokens = (authToken: string, refreshToken: string) : Promise<boolean> => {
  return new Promise<boolean> ((resolve, _) => {
    data().then((config) => {
        config.AccessToken = authToken;
        config.RefreshToken = refreshToken;
        Fs.writeFile(configPath, JSON.stringify(config), (err) => {
            Logger.Log.Warn("updated tokens in config file...");
            resolve(true);
        });
    });
  });
};
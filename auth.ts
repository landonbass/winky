"use strict";


import * as Api          from "./api";
import * as Config       from "./config";
import * as Logger       from "./log";
import * as ReadlineSync from "readline-sync";

export interface IAuthOptions {ApiUrl: string; UserName: string; Password: string; ClientId: string; ClientSecret: string; };
export interface IAuthResult {AccessToken: string; RefreshToken: string; };

export const AuthConverter: Api.IConvertible<IAuthResult> = function (json) {
    return ({AccessToken: json.access_token, RefreshToken: json.refresh_token});
};

export const authenticateAsync = (options: IAuthOptions) : Promise<IAuthResult> => {
  return Api.getDataAsyncSingle<IAuthResult>(AuthConverter, options.ApiUrl, "POST", {"Content-Type": "application/json"}, "{  \"client_id\": \"" + options.ClientId + "\",  \"client_secret\": \"" + options.ClientSecret + "\",  \"username\": \"" + options.UserName + "\",  \"password\": \"" + options.Password + "\",  \"grant_type\": \"password\"}");
};

export const getTokens = (config: Config.IConfig) : Promise<IAuthResult> => {
    return new Promise<IAuthResult> ((resolve, _) => {
        Logger.Log.Info("tokens not found in config");
        const username = ReadlineSync.question("enter user name:");
        const password = ReadlineSync.question("enter password:", {hideEchoBack: true});
        const authOptions: IAuthOptions = {ApiUrl: config.ApiUrl, ClientId: config.ClientId, ClientSecret: config.ClientSecret, UserName: username, Password: password};
        authenticateAsync(authOptions).then((results) => {
            resolve(results);
        });
    });
};
"use strict";


import * as Api from "./api";
import * as Request from "request";

export interface IAuthOptions {ApiUrl: string; UserName: string; Password: string; ClientId: string; ClientSecret: string; };
export interface IAuthResult {AccessToken: string; RefreshToken: string; };

export const AuthConverter: Api.IConvertible<IAuthResult> = function (json) {
    return ({AccessToken: json.access_token, RefreshToken: json.refresh_token});
};

export const authenticateAync = (options: IAuthOptions) : Promise<IAuthResult> => {
  return Api.getDataAsyncSingle<IAuthResult>(AuthConverter, options.ApiUrl, "POST", {"Content-Type": "application/json"}, "{  \"client_id\": \"" + options.ClientId + "\",  \"client_secret\": \"" + options.ClientSecret + "\",  \"username\": \"" + options.UserName + "\",  \"password\": \"" + options.Password + "\",  \"grant_type\": \"password\"}");
};

"use strict";

import * as Request from "request";

export interface IAuthOptions {ApiUrl: string; UserName: string; Password: string; ClientId: string; ClientSecret: string; };
export interface IAuthResult {AccessToken: string; RefreshToken: string; };

export const authenticateAync = (options: IAuthOptions) => {
    return new Promise<IAuthResult>((resolve, _) => {
        Request({
                method: "POST",
                url: options.ApiUrl,
                headers: {"Content-Type": "application/json"},
                body: "{  \"client_id\": \"" + options.ClientId + "\",  \"client_secret\": \"" + options.ClientSecret + "\",  \"username\": \"" + options.UserName + "\",  \"password\": \"" + options.Password + "\",  \"grant_type\": \"password\"}"
            }, (error, response, body) => {
                const data = JSON.parse(body).data;
                resolve ({AccessToken: data.access_token, RefreshToken: data.refresh_token});
            });
    });
};


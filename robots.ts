"use strict";

import * as Api     from "./api";
import * as Auth    from "./auth";
import * as Ui      from "./ui";

export enum RobotStatus {
    Disabled,
    Enabled
}

export interface IRobot {Name: string; Status: RobotStatus; };

export class Robot implements IRobot, Ui.IDisplayFormatter {
    public Name  :  string;
    public Status: RobotStatus;
    public ToDisplayArray = () : Array<string> => {
        return [this.Name, RobotStatus[this.Status]];
    };
}

export const RobotConverter: Api.IConvertible<Robot> = function (json) {
    const r = new Robot();
    r.Name = json.name;
    r.Name = json.name;
    r.Status = json.enabled === true ? RobotStatus.Enabled : RobotStatus.Disabled;
    return r;
};

export const robotsAsync = (options: Auth.IAuthResult) : Promise<Array<Robot>> => {
    return Api.getDataAsync<Robot>(RobotConverter, "https://api.wink.com/users/me/robots", "GET", {"Content-Type": "application/json", "Authorization" : "Bearer " + options.AccessToken}, "");
};
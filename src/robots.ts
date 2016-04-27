"use strict";

import * as Api     from "./api";
import * as Auth    from "./auth";
import * as Ui      from "./ui";

export enum RobotStatus {
    Disabled,
    Enabled
}

export interface IRobot {Id: string; Name: string; Status: RobotStatus; };

export class Robot implements IRobot, Ui.IDisplayFormatter {
    public Id    : string;
    public Name  : string;
    public Status: RobotStatus;
    public ToDisplayArray = () : Array<string> => {
        return [this.Name, RobotStatus[this.Status]];
    };
}

export const RobotConverter: Api.IConvertible<Array<Robot>> = function (json) {
    const robots = new Array<Robot>();
    json.forEach((r) => {
        const robot = new Robot();
        robot.Id = r.robot_id;
        robot.Name = r.name;
        robot.Status = r.enabled === true ? RobotStatus.Enabled : RobotStatus.Disabled;
        robots.push(robot);
    });
    return robots;
};

export const robotsAsync = (options: Auth.IAuthResult) : Promise<Array<Robot>> => {
    return Api.dataAsync<Array<Robot>>(RobotConverter, "https://api.wink.com/users/me/robots", "GET", {"Content-Type": "application/json", "Authorization" : "Bearer " + options.AccessToken}, "");
};

const noop = () => {};

export const toggleRobotState = (options: Auth.IAuthResult, robot: Robot) : Promise <void> => {
    const newStateJson = `{"enabled":${robot.Status === RobotStatus.Enabled ? false : true}}`;  
    return Api.dataAsync<void>(noop, `https://api.wink.com/robots/${robot.Id}`, "PUT", {"Content-Type": "application/json", "Authorization" : "Bearer " + options.AccessToken}, newStateJson);
}
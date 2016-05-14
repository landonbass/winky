"use strict";

import * as Api     from "./api";
import * as Auth    from "./auth";
import * as Ui      from "./ui";
import * as Utility from "./utility";

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
        robots.push(ParseRobotFromJson(r));
    });
    return robots;
};

const ParseRobotFromJson = (json: Object) : Robot => {
    const robot = new Robot();
    robot.Id = json["robot_id"];
    robot.Name = json["name"];
    robot.Status = json["enabled"] === true ? RobotStatus.Enabled : RobotStatus.Disabled;
    return robot; 
};

export const robotsAsync = (options: Auth.IAuthResult) : Promise<Array<Robot>> => {
    return Api.dataAsync<Array<Robot>>(RobotConverter, "https://api.wink.com/users/me/robots", "GET", {"Content-Type": "application/json", "Authorization" : "Bearer " + options.AccessToken}, "");
};

export const toggleRobotState = (options: Auth.IAuthResult, robot: Robot) : Promise <void> => {
    const newStateJson = `{"enabled":${robot.Status === RobotStatus.Enabled ? false : true}}`;  
    return Api.dataAsync<void>(Utility.noop, `https://api.wink.com/robots/${robot.Id}`, "PUT", {"Content-Type": "application/json", "Authorization" : "Bearer " + options.AccessToken}, newStateJson);
}
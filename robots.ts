"use strict";

import * as Auth    from "./auth";
import * as Request from "request";
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

export const robotsAsync = (options: Auth.IAuthResult) => {
    return new Promise<Array<Robot>>( (resolve, _) => {
        Request({
            method: "GET",
            url: "https://api.wink.com/users/me/robots",
            headers: {"Content-Type": "application/json", "Authorization" : "Bearer " + options.AccessToken}
        }, (error, response, body) => {
            let robots = Array<Robot>();
            JSON.parse(body).data.forEach((robot) => {
                const r = new Robot();
                r.Name = robot.name;
                r.Status = robot.enabled === true ? RobotStatus.Enabled : RobotStatus.Disabled;
                robots.push(r);
            });
            robots.sort();
            resolve(robots);
        });
    });
};
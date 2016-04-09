"use strict";
const Request = require("request");
(function (RobotStatus) {
    RobotStatus[RobotStatus["Disabled"] = 0] = "Disabled";
    RobotStatus[RobotStatus["Enabled"] = 1] = "Enabled";
})(exports.RobotStatus || (exports.RobotStatus = {}));
var RobotStatus = exports.RobotStatus;
;
class Robot {
    constructor() {
        this.ToDisplayArray = () => {
            return [this.Name, RobotStatus[this.Status]];
        };
    }
}
exports.Robot = Robot;
exports.robotsAsync = (options) => {
    return new Promise((resolve, _) => {
        Request({
            method: "GET",
            url: "https://api.wink.com/users/me/robots",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + options.AccessToken }
        }, (error, response, body) => {
            let robots = Array();
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
//# sourceMappingURL=robots.js.map
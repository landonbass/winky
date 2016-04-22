"use strict";
const Api = require("./api");
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
exports.RobotConverter = function (json) {
    const robots = new Array();
    json.forEach((r) => {
        const robot = new Robot();
        robot.Id = r.robot_id;
        robot.Name = r.name;
        robot.Status = r.enabled === true ? RobotStatus.Enabled : RobotStatus.Disabled;
        robots.push(robot);
    });
    return robots;
};
exports.robotsAsync = (options) => {
    return Api.getDataAsync(exports.RobotConverter, "https://api.wink.com/users/me/robots", "GET", { "Content-Type": "application/json", "Authorization": "Bearer " + options.AccessToken }, "");
};
//# sourceMappingURL=robots.js.map
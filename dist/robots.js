"use strict";
const Api = require("./api");
const Utility = require("./utility");
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
    return Api.dataAsync(exports.RobotConverter, "https://api.wink.com/users/me/robots", "GET", { "Content-Type": "application/json", "Authorization": "Bearer " + options.AccessToken }, "");
};
exports.toggleRobotState = (options, robot) => {
    const newStateJson = `{"enabled":${robot.Status === RobotStatus.Enabled ? false : true}}`;
    return Api.dataAsync(Utility.noop, `https://api.wink.com/robots/${robot.Id}`, "PUT", { "Content-Type": "application/json", "Authorization": "Bearer " + options.AccessToken }, newStateJson);
};
//# sourceMappingURL=robots.js.map
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
    const r = new Robot();
    r.Name = json.name;
    r.Name = json.name;
    r.Status = json.enabled === true ? RobotStatus.Enabled : RobotStatus.Disabled;
    return r;
};
exports.robotsAsync = (options) => {
    return Api.getDataAsync(exports.RobotConverter, "https://api.wink.com/users/me/robots", "GET", { "Content-Type": "application/json", "Authorization": "Bearer " + options.AccessToken }, "");
};
//# sourceMappingURL=robots.js.map
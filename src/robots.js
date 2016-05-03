"use strict";
var Api = require("./api");
var Utility = require("./utility");
(function (RobotStatus) {
    RobotStatus[RobotStatus["Disabled"] = 0] = "Disabled";
    RobotStatus[RobotStatus["Enabled"] = 1] = "Enabled";
})(exports.RobotStatus || (exports.RobotStatus = {}));
var RobotStatus = exports.RobotStatus;
;
var Robot = (function () {
    function Robot() {
        var _this = this;
        this.ToDisplayArray = function () {
            return [_this.Name, RobotStatus[_this.Status]];
        };
    }
    return Robot;
}());
exports.Robot = Robot;
exports.RobotConverter = function (json) {
    var robots = new Array();
    json.forEach(function (r) {
        var robot = new Robot();
        robot.Id = r.robot_id;
        robot.Name = r.name;
        robot.Status = r.enabled === true ? RobotStatus.Enabled : RobotStatus.Disabled;
        robots.push(robot);
    });
    return robots;
};
exports.robotsAsync = function (options) {
    return Api.dataAsync(exports.RobotConverter, "https://api.wink.com/users/me/robots", "GET", { "Content-Type": "application/json", "Authorization": "Bearer " + options.AccessToken }, "");
};
exports.toggleRobotState = function (options, robot) {
    var newStateJson = "{\"enabled\":" + (robot.Status === RobotStatus.Enabled ? false : true) + "}";
    return Api.dataAsync(Utility.noop, "https://api.wink.com/robots/" + robot.Id, "PUT", { "Content-Type": "application/json", "Authorization": "Bearer " + options.AccessToken }, newStateJson);
};

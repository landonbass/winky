"use strict";
var Api = require("./api");
;
(function (GroupStatus) {
    GroupStatus[GroupStatus["Off"] = 0] = "Off";
    GroupStatus[GroupStatus["On"] = 1] = "On";
    GroupStatus[GroupStatus["Unknown"] = 2] = "Unknown";
    GroupStatus[GroupStatus["NA"] = 3] = "NA";
})(exports.GroupStatus || (exports.GroupStatus = {}));
var GroupStatus = exports.GroupStatus;
;
var Group = (function () {
    function Group() {
        var _this = this;
        this.ToDisplayArray = function () {
            return [_this.Name, GroupStatus[_this.Status]];
        };
    }
    return Group;
}());
exports.Group = Group;
exports.GroupConverter = function (json) {
    var groups = new Array();
    json.forEach(function (g) {
        var group = new Group();
        group.Id = g.group_id;
        group.Name = g.name;
        group.Status = g.reading_aggregation.powered.or === true || g.reading_aggregation.powered.and === true ? GroupStatus.On : GroupStatus.Off;
        groups.push(group);
    });
    return groups;
};
exports.groupsAsync = function (options) {
    return Api.dataAsync(exports.GroupConverter, "https://api.wink.com/users/me/groups", "GET", { "Content-Type": "application/json", "Authorization": "Bearer " + options.AccessToken }, "");
};

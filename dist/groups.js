"use strict";
const Api = require("./api");
;
(function (GroupStatus) {
    GroupStatus[GroupStatus["Off"] = 0] = "Off";
    GroupStatus[GroupStatus["On"] = 1] = "On";
    GroupStatus[GroupStatus["Unknown"] = 2] = "Unknown";
    GroupStatus[GroupStatus["NA"] = 3] = "NA";
})(exports.GroupStatus || (exports.GroupStatus = {}));
var GroupStatus = exports.GroupStatus;
;
class Group {
    constructor() {
        this.ToDisplayArray = () => {
            return [this.Name, GroupStatus[this.Status]];
        };
    }
}
exports.Group = Group;
exports.GroupConverter = function (json) {
    const groups = new Array();
    json.forEach((g) => {
        const group = new Group();
        group.Id = g.group_id;
        group.Name = g.name;
        group.Status = g.reading_aggregation.powered.or === true || g.reading_aggregation.powered.and === true ? GroupStatus.On : GroupStatus.Off;
        groups.push(group);
    });
    return groups;
};
exports.groupsAsync = (options) => {
    return Api.dataAsync(exports.GroupConverter, "https://api.wink.com/users/me/groups", "GET", { "Content-Type": "application/json", "Authorization": "Bearer " + options.AccessToken }, "");
};
//# sourceMappingURL=groups.js.map
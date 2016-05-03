"use strict";
const Api = require("./api");
const Utility = require("./utility");
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
// generate swap state json for supported devices
const generateSwapStateJson = (group) => {
    let state = "";
    const newStatus = group.Status === GroupStatus.On ? false : true;
    state = `{"desired_state":{"powered":${newStatus}}}`;
    return state;
};
const setGroupState = (options, groupId, state) => {
    return Api.dataAsync(Utility.noop, `https://api.wink.com/groups/${groupId}/activate`, "POST", { "Content-Type": "application/json", "Authorization": "Bearer " + options.AccessToken }, state);
};
exports.groupsAsync = (options) => {
    return Api.dataAsync(exports.GroupConverter, "https://api.wink.com/users/me/groups", "GET", { "Content-Type": "application/json", "Authorization": "Bearer " + options.AccessToken }, "");
};
exports.toggleGroupState = (options, group) => {
    return setGroupState(options, group.Id, generateSwapStateJson(group));
};
//# sourceMappingURL=groups.js.map
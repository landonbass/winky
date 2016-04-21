"use strict";
const Api = require("./api");
;
class Group {
    constructor() {
        this.ToDisplayArray = () => {
            return [this.Name];
        };
    }
}
exports.Group = Group;
exports.GroupConverter = function (json) {
    const groups = new Array();
    json.forEach((r) => {
        const group = new Group();
        group.Name = r.name;
        groups.push(group);
    });
    return groups;
};
exports.groupsAsync = (options) => {
    return Api.getDataAsync(exports.GroupConverter, "https://api.wink.com/users/me/groups", "GET", { "Content-Type": "application/json", "Authorization": "Bearer " + options.AccessToken }, "");
};
//# sourceMappingURL=groups.js.map
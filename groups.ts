"use strict";

import * as Api     from "./api";
import * as Auth    from "./auth";
import * as Ui      from "./ui";


export interface IGroup {Name: string; };

export class Group implements IGroup, Ui.IDisplayFormatter {
    public Name  :  string;
    public ToDisplayArray = () : Array<string> => {
        return [this.Name];
    };
}

export const GroupConverter: Api.IConvertible<Array<Group>> = function (json) {
    const groups = new Array<Group>();
    json.forEach((r) => {
        const group = new Group();
        group.Name = r.name;
        groups.push(group);
    });
    return groups;
};

export const groupsAsync = (options: Auth.IAuthResult) : Promise<Array<Group>> => {
    return Api.getDataAsync<Array<Group>>(GroupConverter, "https://api.wink.com/users/me/groups", "GET", {"Content-Type": "application/json", "Authorization" : "Bearer " + options.AccessToken}, "");
};
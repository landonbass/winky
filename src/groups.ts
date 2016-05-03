"use strict";

import * as Api     from "./api";
import * as Auth    from "./auth";
import * as Ui      from "./ui";


export interface IGroup {Id: string; Name: string; };

export enum GroupStatus { Off, On, Unknown, NA};

export class Group implements IGroup, Ui.IDisplayFormatter {
    public Id     : string;
    public Name   : string;
    public Status : GroupStatus;
    public ToDisplayArray = () : Array<string> => {
        return [this.Name, GroupStatus[this.Status]];
    };
}

export const GroupConverter: Api.IConvertible<Array<Group>> = function (json) {
    const groups = new Array<Group>();
    json.forEach((g) => {
        const group = new Group();
        group.Id   = g.group_id;
        group.Name = g.name;
        group.Status = g.reading_aggregation.powered.or === true || g.reading_aggregation.powered.and === true ? GroupStatus.On : GroupStatus.Off;
        groups.push(group);
    });
    return groups;
};

export const groupsAsync = (options: Auth.IAuthResult) : Promise<Array<Group>> => {
    return Api.dataAsync<Array<Group>>(GroupConverter, "https://api.wink.com/users/me/groups", "GET", {"Content-Type": "application/json", "Authorization" : "Bearer " + options.AccessToken}, "");
};
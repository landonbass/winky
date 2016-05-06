"use strict";

import * as Api     from "./api";
import * as Auth    from "./auth";
import * as Ui      from "./ui";
import * as Utility from "./utility";

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
        group.Status = getAggregationReading(g);
        groups.push(group);
    });
    return groups;
};

const getAggregationReading = (json: Object) : GroupStatus => {
    if (json["reading_aggregation"]["powered"] === undefined) return GroupStatus.NA;
    const value = json["reading_aggregation"]["powered"];
    if (value["or"] === undefined || value === undefined) return GroupStatus.Unknown;
    
    return value["or"] === true || value === true ? GroupStatus.On : GroupStatus.Off;
}

// generate swap state json for supported devices
const generateSwapStateJson = (group: Group) : string => {
    let state = "";
    const newStatus = group.Status === GroupStatus.On ? false : true;
    state = `{"desired_state":{"powered":${newStatus}}}`;
    return state;
};

const setGroupState = (options: Auth.IAuthResult, groupId: string, state: string) : Promise<void> => {
    return Api.dataAsync<void>(Utility.noop, `https://api.wink.com/groups/${groupId}/activate`, "POST", {"Content-Type": "application/json", "Authorization" : "Bearer " + options.AccessToken}, state);
};

export const groupsAsync = (options: Auth.IAuthResult) : Promise<Array<Group>> => {
    return Api.dataAsync<Array<Group>>(GroupConverter, "https://api.wink.com/users/me/groups", "GET", {"Content-Type": "application/json", "Authorization" : "Bearer " + options.AccessToken}, "");
};

export const toggleGroupState = (options: Auth.IAuthResult, group: Group) : Promise <void> => {
    return setGroupState(options, group.Id, generateSwapStateJson(group));
}
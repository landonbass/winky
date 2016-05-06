"use strict";

export const noop = () => {};

export const isNullUndefinedEmpty = (value: any) : boolean => {
    if (value === null || value === undefined || value === "") return true;
    return false;
}
"use strict";

// no op function used as placeholders where void are returned. TODO research a refactor
export const noop = () => {};

// simple test to see if a value is not null, undefined, or empty string
export const isNullUndefinedEmpty = (value: any) : boolean => {
    if (value === null || value === undefined || value === "") return true;
    return false;
}
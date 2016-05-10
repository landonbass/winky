"use strict";
exports.noop = () => { };
exports.isNullUndefinedEmpty = (value) => {
    if (value === null || value === undefined || value === "")
        return true;
    return false;
};

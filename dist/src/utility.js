"use strict";
// no op function used as placeholders where void are returned. TODO research a refactor
exports.noop = () => { };
// simple test to see if a value is not null, undefined, or empty string
exports.isNullUndefinedEmpty = (value) => {
    if (value === null || value === undefined || value === "")
        return true;
    return false;
};
//# sourceMappingURL=utility.js.map
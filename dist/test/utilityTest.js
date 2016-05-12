"use strict";
/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />
const Chai = require("chai");
const Utility = require('../src/utility');
describe("Noop", () => {
    describe("#implementation", () => {
        it("should result in no operation", () => {
            const noop = Utility.noop;
            Chai.assert.equal(noop(), undefined, "noop returned a value");
        });
    });
});
describe("IsUndefinedNullOrEmpty", () => {
    describe("Undefined", () => {
        Chai.assert.equal(true, Utility.isNullUndefinedEmpty(undefined));
    });
    describe("Null", () => {
        Chai.assert.equal(true, Utility.isNullUndefinedEmpty(null));
    });
    describe("Empty", () => {
        Chai.assert.equal(true, Utility.isNullUndefinedEmpty(""));
    });
    describe("Value", () => {
        Chai.assert.equal(false, Utility.isNullUndefinedEmpty(true));
    });
});
//# sourceMappingURL=utilityTest.js.map
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

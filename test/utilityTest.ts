

/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />
import * as Chai from "chai";

import * as Utility from '../src/utility';

describe("Noop", () => {
    describe("#implementation", () => {
        it("should result in no operation", () => {
            const noop = Utility.noop;
            Chai.assert.equal(noop(), undefined, "noop returned a value");
        });
    });
});

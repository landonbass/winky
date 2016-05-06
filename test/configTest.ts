

/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />
/// <reference path="../typings/node/node.d.ts" />

import * as Chai   from "chai";
import * as Config from '../src/config';
import * as Fs     from "fs";
import * as Path   from "path";

const fileExists = (filePath) => {
    try {
        return Fs.statSync(filePath).isFile();
    }
    catch (err) {
        return false;
    }
}

describe("Config", () => {
    describe("#path", () => {
        it("should crate config.json if it does not exist", () => {
            Config.data().then((data) => {
                Chai.assert.equal(fileExists(Path.join(__dirname, "..", "config.json")), true, "config.json should be created if it does not exist");
            });
        });
    });
});

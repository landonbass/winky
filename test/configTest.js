/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />
/// <reference path="../typings/node/node.d.ts" />
"use strict";
const Chai = require("chai");
const Config = require('../src/config');
const Fs = require("fs");
const Path = require("path");
const fileExists = (filePath) => {
    try {
        return Fs.statSync(filePath).isFile();
    }
    catch (err) {
        return false;
    }
};
describe("Config", () => {
    describe("#path", () => {
        it("should crate config.json if it does not exist", () => {
            Config.data().then((data) => {
                Chai.assert.equal(fileExists(Path.join(__dirname, "..", "config1.json")), true, "config.json should be created if it does not exist");
            });
        });
    });
});

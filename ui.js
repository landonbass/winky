"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const Async = require("async");
const Blessed = require("blessed");
const Contrib = require("blessed-contrib");
const Logger = require("./log");
const Devices = require("./devices");
const Robots = require("./robots");
function Setup(authTokens) {
    const screen = Blessed.screen();
    const grid = new Contrib.grid({ rows: 12, cols: 12, screen: screen });
    const deviceTable = grid.set(0, 0, 8, 8, Contrib.table, {
        keys: true,
        fg: "white",
        selectedFg: "white",
        selectedBg: "blue",
        interactive: true,
        label: "Devices - 'd' to focus",
        border: { type: "line", fg: "cyan" },
        columnSpacing: 10,
        columnWidth: [40, 40, 7]
    });
    const robotTable = grid.set(0, 8, 8, 12, Contrib.table, {
        keys: true,
        fg: "white",
        selectedFg: "white",
        selectedBg: "blue",
        interactive: true,
        label: "Robots - 'r' to focus",
        border: { type: "line", fg: "cyan" },
        columnSpacing: 10,
        columnWidth: [40, 40]
    });
    const log = grid.set(8, 0, 4, 12, Contrib.log, { fg: "green",
        selectedFg: "green",
        label: "Log" });
    const uiLogger = (message) => {
        log.log(message);
    };
    Logger.logEmitter.addListener("log", uiLogger);
    screen.key(["C-c", "escape", "q"], function (ch, key) {
        return process.exit(0);
    });
    screen.key(["r", "R"], function (ch, key) {
        robotTable.focus();
    });
    screen.key(["d", "D"], function (ch, key) {
        deviceTable.focus();
    });
    screen.key(["y", "Y"], function (ch, key) {
        RefreshData(authTokens).then((data) => {
            DrawUi(data);
        });
    });
    const DrawUi = (data) => {
        const deviceData = [];
        data[0].forEach((device) => {
            deviceData.push(device.ToDisplayArray());
        });
        deviceTable.setData({ headers: ["Name", "Type", "Battery"], data: deviceData });
        const robotData = [];
        data[1].forEach((robot) => {
            robotData.push(robot.ToDisplayArray());
        });
        robotTable.setData({ headers: ["Name", "Status"], data: robotData });
        screen.render();
    };
    RefreshData(authTokens).then((data) => {
        DrawUi(data);
    });
}
exports.Setup = Setup;
const RefreshData = (authTokens) => {
    return new Promise((resolve, _) => {
        Async.parallel([
                (cb) => __awaiter(this, void 0, void 0, function* () {
                Devices.devicesAsync(authTokens).then((devices) => {
                    cb(null, devices);
                });
            }),
                (cb) => __awaiter(this, void 0, void 0, function* () {
                Robots.robotsAsync(authTokens).then((robots) => {
                    cb(null, robots);
                });
            })
        ], (err, results) => {
            resolve([results[0], results[1]]);
        });
    });
};
//# sourceMappingURL=ui.js.map
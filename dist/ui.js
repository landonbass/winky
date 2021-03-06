"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
/*
    a terminal ui
*/
const Async = require("async");
const Blessed = require("blessed");
const Contrib = require("blessed-contrib");
const Logger = require("./log");
const Devices = require("./devices");
const Groups = require("./groups");
const Robots = require("./robots");
let devicesLookup = [], groupsLookup = [], robotsLookup = [];
function Setup(authTokens) {
    const screen = Blessed.screen();
    const grid = new Contrib.grid({ rows: 12, cols: 12, screen: screen });
    const deviceTable = grid.set(0, 0, 9, 8, Contrib.table, {
        keys: true,
        fg: "white",
        selectedFg: "white",
        selectedBg: "blue",
        interactive: true,
        label: "Devices - 'd' to focus",
        border: { type: "line", fg: "cyan" },
        columnSpacing: 1,
        columnWidth: [35, 20, 40, 7]
    });
    const groupTable = grid.set(0, 6, 9, 9, Contrib.table, {
        keys: true,
        fg: "white",
        selectedFg: "white",
        selectedBg: "blue",
        interactive: true,
        label: "Groups - 'g' to focus",
        border: { type: "line", fg: "cyan" },
        columnSpacing: 1,
        columnWidth: [20, 7]
    });
    const robotTable = grid.set(0, 8, 9, 12, Contrib.table, {
        keys: true,
        fg: "white",
        selectedFg: "white",
        selectedBg: "blue",
        interactive: true,
        label: "Robots - 'r' to focus",
        border: { type: "line", fg: "cyan" },
        columnSpacing: 1,
        columnWidth: [30, 20]
    });
    const log = grid.set(8, 0, 4, 12, Contrib.log, { fg: "green",
        selectedFg: "green",
        label: "Log" });
    const uiLogger = (message) => {
        log.log(message);
    };
    Logger.logEmitter.addListener("log", uiLogger);
    Logger.Log.Info(`using access token: ${Array(20).join("*") + authTokens.AccessToken.substring(20, authTokens.AccessToken.length)}`);
    screen.key(["C-c", "escape", "q"], (ch, key) => {
        return process.exit(0);
    });
    screen.key(["r", "R"], (ch, key) => {
        robotTable.focus();
    });
    screen.key(["d", "D"], (ch, key) => {
        deviceTable.focus();
    });
    screen.key(["g", "G"], (ch, key) => {
        groupTable.focus();
    });
    screen.key(["y", "Y"], (ch, key) => {
        RefreshData(authTokens).then((data) => {
            DrawUi(data);
            Logger.Log.Info("refreshed data...");
        });
    });
    deviceTable.rows.on("select", (data, index) => {
        const device = devicesLookup[index];
        Logger.Log.Info(`selected device with id ${device.Id}`);
        Devices.toggleDeviceState(authTokens, device); /*.then((result) => {
             setTimeout(
                 () => {
                     RefreshData(authTokens).then((data) => {
                         DrawUi(data);
                         Logger.Log.Info("refreshed data...");
                     });
                 }, 3000);
        });*/
    });
    groupTable.rows.on("select", (data, index) => {
        const group = groupsLookup[index];
        Logger.Log.Info(`selected group with id ${group.Id}`);
        Groups.toggleGroupState(authTokens, group);
    });
    robotTable.rows.on("select", (data, index) => {
        const robot = robotsLookup[index];
        Logger.Log.Info(`selected robot with id ${robot.Id}`);
        Robots.toggleRobotState(authTokens, robot);
    });
    const DrawUi = (data) => {
        const deviceData = [];
        data[0].forEach((device) => {
            deviceData.push(device.ToDisplayArray());
        });
        deviceTable.setData({ headers: ["Name", "Type", "Status", "Battery"], data: deviceData });
        const robotData = [];
        data[1].forEach((robot) => {
            robotData.push(robot.ToDisplayArray());
        });
        robotTable.setData({ headers: ["Name", "Status"], data: robotData });
        const groupData = [];
        data[2].forEach((group) => {
            groupData.push(group.ToDisplayArray());
        });
        groupTable.setData({ headers: ["Name", "Status"], data: groupData });
        screen.render();
    };
    RefreshData(authTokens).then((data) => {
        DrawUi(data);
    });
}
exports.Setup = Setup;
const RefreshData = (authTokens) => {
    return new Promise((resolve, _) => {
        Async.parallel({
            devices: (cb) => __awaiter(this, void 0, void 0, function* () {
                Devices.devicesAsync(authTokens).then((devices) => {
                    Logger.Log.Info(`obtained ${devices.length} devices...`);
                    devicesLookup = devices;
                    cb(null, devices);
                });
            }),
            robots: (cb) => __awaiter(this, void 0, void 0, function* () {
                Robots.robotsAsync(authTokens).then((robots) => {
                    Logger.Log.Info(`obtained ${robots.length} robots...`);
                    robotsLookup = robots;
                    cb(null, robots);
                });
            }),
            groups: (cb) => __awaiter(this, void 0, void 0, function* () {
                Groups.groupsAsync(authTokens).then((groups) => {
                    Logger.Log.Info(`obtained ${groups.length} groups...`);
                    groupsLookup = groups;
                    cb(null, groups);
                });
            })
        }, (err, results) => {
            // this is to satsify ts' typing checks
            const devices = results["devices"], robots = results["robots"], groups = results["groups"];
            resolve([devices, robots, groups]);
        });
    });
};
//# sourceMappingURL=ui.js.map
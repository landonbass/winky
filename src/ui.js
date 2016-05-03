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
var Async = require("async");
var Blessed = require("blessed");
var Contrib = require("blessed-contrib");
var Logger = require("./log");
var Devices = require("./devices");
var Groups = require("./groups");
var Robots = require("./robots");
var devicesLookup = [], groupsLookup = [], robotsLookup = [];
function Setup(authTokens) {
    var screen = Blessed.screen();
    var grid = new Contrib.grid({ rows: 12, cols: 12, screen: screen });
    var deviceTable = grid.set(0, 0, 9, 8, Contrib.table, {
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
    var groupTable = grid.set(0, 6, 9, 9, Contrib.table, {
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
    var robotTable = grid.set(0, 8, 9, 12, Contrib.table, {
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
    var log = grid.set(8, 0, 4, 12, Contrib.log, { fg: "green",
        selectedFg: "green",
        label: "Log" });
    var uiLogger = function (message) {
        log.log(message);
    };
    Logger.logEmitter.addListener("log", uiLogger);
    Logger.Log.Info("using access token: " + (Array(20).join("*") + authTokens.AccessToken.substring(20, authTokens.AccessToken.length)));
    screen.key(["C-c", "escape", "q"], function (ch, key) {
        return process.exit(0);
    });
    screen.key(["r", "R"], function (ch, key) {
        robotTable.focus();
    });
    screen.key(["d", "D"], function (ch, key) {
        deviceTable.focus();
    });
    screen.key(["g", "G"], function (ch, key) {
        groupTable.focus();
    });
    screen.key(["y", "Y"], function (ch, key) {
        RefreshData(authTokens).then(function (data) {
            DrawUi(data);
            Logger.Log.Info("refreshed data...");
        });
    });
    deviceTable.rows.on("select", function (data, index) {
        var device = devicesLookup[index];
        Logger.Log.Info("selected device with id " + device.Id);
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
    groupTable.rows.on("select", function (data, index) {
        Logger.Log.Info("selected group with id " + groupsLookup[index].Id);
    });
    robotTable.rows.on("select", function (data, index) {
        var robot = robotsLookup[index];
        Logger.Log.Info("selected robot with id " + robot.Id);
        Robots.toggleRobotState(authTokens, robot);
    });
    var DrawUi = function (data) {
        var deviceData = [];
        data[0].forEach(function (device) {
            deviceData.push(device.ToDisplayArray());
        });
        deviceTable.setData({ headers: ["Name", "Type", "Status", "Battery"], data: deviceData });
        var robotData = [];
        data[1].forEach(function (robot) {
            robotData.push(robot.ToDisplayArray());
        });
        robotTable.setData({ headers: ["Name", "Status"], data: robotData });
        var groupData = [];
        data[2].forEach(function (group) {
            groupData.push(group.ToDisplayArray());
        });
        groupTable.setData({ headers: ["Name", "Status"], data: groupData });
        screen.render();
    };
    RefreshData(authTokens).then(function (data) {
        DrawUi(data);
    });
}
exports.Setup = Setup;
var RefreshData = function (authTokens) {
    return new Promise(function (resolve, _) {
        Async.parallel({
            devices: function (cb) __awaiter(this, void 0, void 0, function* () {
                Devices.devicesAsync(authTokens).then(function (devices) {
                    Logger.Log.Info("obtained " + devices.length + " devices...");
                    devicesLookup = devices;
                    cb(null, devices);
                });
            }),
            robots: function (cb) __awaiter(this, void 0, void 0, function* () {
                Robots.robotsAsync(authTokens).then(function (robots) {
                    Logger.Log.Info("obtained " + robots.length + " robots...");
                    robotsLookup = robots;
                    cb(null, robots);
                });
            }),
            groups: function (cb) __awaiter(this, void 0, void 0, function* () {
                Groups.groupsAsync(authTokens).then(function (groups) {
                    Logger.Log.Info("obtained " + groups.length + " groups...");
                    groupsLookup = groups;
                    cb(null, groups);
                });
            })
        }, function (err, results) {
            // this is to satsify ts' typing checks
            var devices = results[0]["devices"], robots = results[0]["robots"], groups = results[0]["groups"];
            resolve([devices, robots, groups]);
        });
    });
};

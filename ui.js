"use strict";
const Blessed = require("blessed");
const Contrib = require("blessed-contrib");
const Logger = require("./log");
function Setup(devices, robots) {
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
    // TODO remove thise Logger.logEmitter.removeListerner("log", "consoleLogger");
    const deviceData = [];
    devices.forEach((device) => {
        Logger.Log.Info("loading device " + device.Name);
        deviceData.push(device.ToDisplayArray());
    });
    deviceTable.focus();
    deviceTable.setData({ headers: ["Name", "Type", "Battery"], data: deviceData });
    const robotData = [];
    robots.forEach((robot) => {
        Logger.Log.Info("loading robot " + robot.Name);
        robotData.push(robot.ToDisplayArray());
    });
    robotTable.setData({ headers: ["Name", "Status"], data: robotData });
    screen.key(["C-c", "escape", "q"], function (ch, key) {
        return process.exit(0);
    });
    screen.key(["r", "R"], function (ch, key) {
        robotTable.focus();
    });
    screen.key(["d", "D"], function (ch, key) {
        deviceTable.focus();
    });
    screen.render();
}
exports.Setup = Setup;
//# sourceMappingURL=ui.js.map
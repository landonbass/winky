"use strict";
const Blessed = require("blessed");
const Contrib = require("blessed-contrib");
function Setup(devices) {
    var screen = Blessed.screen();
    var deviceTable = Contrib.table({ keys: true,
        fg: "white",
        selectedFg: "white",
        selectedBg: "blue",
        interactive: true,
        label: "Devices",
        width: "80%",
        height: "80%",
        border: { type: "line", fg: "cyan" },
        columnSpacing: 10,
        columnWidth: [40, 40, 7] });
    const deviceData = [];
    devices.forEach((device) => {
        deviceData.push(device.ToDisplayArray());
    });
    deviceTable.focus();
    deviceTable.setData({ headers: ["Name", "Type", "Battery"], data: deviceData });
    screen.append(deviceTable);
    screen.key(["C-c", "escape", "q"], function (ch, key) {
        return process.exit(0);
    });
    screen.render();
}
exports.Setup = Setup;
//# sourceMappingURL=ui.js.map
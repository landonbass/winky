"use strict";

import * as Blessed from "blessed";
import * as Contrib from "blessed-contrib";

import * as Devices from "./devices";

export interface IDisplayFormatter {
    ToDisplayArray() : Array<string>;
}

export function Setup(devices: Array<Devices.Device>) {
     var screen = Blessed.screen();
    
     var deviceTable = Contrib.table(
     { keys: true
     , fg: "white"
     , selectedFg: "white"
     , selectedBg: "blue"
     , interactive: true
     , label: "Devices"
     , width: "80%"
     , height: "80%"
     , border: {type: "line", fg: "cyan"}
     , columnSpacing: 10
     , columnWidth: [40, 40, 7]});
   
   const deviceData = [];
   devices.forEach((device) => {
      deviceData.push(device.ToDisplayArray());
   });
   deviceTable.focus();
   deviceTable.setData({headers: ["Name", "Type", "Battery"], data: deviceData});
   screen.append(deviceTable);
   screen.key(["C-c", "escape", "q"], function(ch, key) {
     return process.exit(0);
   });

   screen.render();
   
}
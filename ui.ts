"use strict";

import * as Async   from "async";
import * as Blessed from "blessed";
import * as Contrib from "blessed-contrib";

import * as Auth    from "./auth";
import * as Logger  from "./log";
import * as Devices from "./devices";
import * as Robots  from "./robots";

export interface IDisplayFormatter {
    ToDisplayArray() : Array<string>;
}

export function Setup(authTokens: Auth.IAuthResult) {
     const screen = Blessed.screen();
     const grid = new Contrib.grid({rows: 12, cols: 12, screen: screen});
     const deviceTable = grid.set(0, 0, 8, 8, Contrib.table,  { 
         keys: true
        , fg: "white"
        , selectedFg: "white"
        , selectedBg: "blue"
        , interactive: true
        , label: "Devices - 'd' to focus"
        , border: {type: "line", fg: "cyan"}
        , columnSpacing: 10
        , columnWidth: [40, 40, 7]
    });
    const robotTable = grid.set(0, 8, 8, 12, Contrib.table,  { 
         keys: true
        , fg: "white"
        , selectedFg: "white"
        , selectedBg: "blue"
        , interactive: true
        , label: "Robots - 'r' to focus"
        , border: {type: "line", fg: "cyan"}
        , columnSpacing: 10
        , columnWidth: [40, 40]
    });
    const log = grid.set(8, 0, 4, 12, Contrib.log, { fg: "green"
      , selectedFg: "green"
      , label: "Log"});
   
   
   const uiLogger = (message) => {
       log.log(message);
   };
   
   Logger.logEmitter.addListener("log", uiLogger);
  
   screen.key(["C-c", "escape", "q"], function(ch, key) {
     return process.exit(0);
   });

   screen.key(["r", "R"], function(ch, key) {
     robotTable.focus();
   });
   screen.key(["d", "D"], function(ch, key) {
     deviceTable.focus();
   });
   screen.key(["y", "Y"], function(ch, key) {
     RefreshData(authTokens).then( (data) => {
       DrawUi(data);
       Logger.Log.Info("refreshed data...");
     });
   });
   
   
   const DrawUi = (data) => {
        const deviceData = [];
        data[0].forEach((device) => {
            deviceData.push(device.ToDisplayArray());
        });
        deviceTable.setData({headers: ["Name", "Type", "Battery"], data: deviceData});
        const robotData = [];
        data[1].forEach((robot) => {
            robotData.push(robot.ToDisplayArray());
        });
        robotTable.setData({headers: ["Name", "Status"], data: robotData});
        screen.render();
   };
   RefreshData(authTokens).then((data) => {
       DrawUi(data);
   });
}

const RefreshData = (authTokens: Auth.IAuthResult) => {
    return new Promise<[Array<Devices.Device>, Array<Robots.Robot>]>( (resolve, _) => {
        Async.parallel([
            async (cb) => {
                Devices.devicesAsync(authTokens).then((devices) => {
                    cb(null, devices);
                });
            },
            async (cb) => {
                Robots.robotsAsync(authTokens).then((robots) => {
                cb(null, robots);
                });
            }
        ], (err, results) => {
        resolve([results[0], results[1]]);
        });
    });
};
"use strict";

/*
    a terminal ui
*/

import * as Async   from "async";
import * as Blessed from "blessed";
import * as Contrib from "blessed-contrib";

import * as Auth    from "./auth";
import * as Logger  from "./log";
import * as Devices from "./devices";
import * as Groups  from "./groups";
import * as Robots  from "./robots";


let devicesLookup = [],
    groupsLookup  = [],
    robotsLookup  = [];

export interface IDisplayFormatter {
    ToDisplayArray() : Array<string>;
}

export function Setup(authTokens: Auth.IAuthResult) {
     const screen = Blessed.screen();
     const grid = new Contrib.grid({rows: 12, cols: 12, screen: screen});
     const deviceTable = grid.set(0, 0, 9, 8, Contrib.table,  { 
         keys: true
        , fg: "white"
        , selectedFg: "white"
        , selectedBg: "blue"
        , interactive: true
        , label: "Devices - 'd' to focus"
        , border: {type: "line", fg: "cyan"}
        , columnSpacing: 1
        , columnWidth: [35, 20, 40, 7]
    });
    const groupTable = grid.set(0, 6, 9, 9, Contrib.table,  { 
         keys: true
        , fg: "white"
        , selectedFg: "white"
        , selectedBg: "blue"
        , interactive: true
        , label: "Groups - 'g' to focus"
        , border: {type: "line", fg: "cyan"}
        , columnSpacing: 1
        , columnWidth: [20, 7]
    });
    const robotTable = grid.set(0, 8, 9, 12, Contrib.table,  { 
         keys: true
        , fg: "white"
        , selectedFg: "white"
        , selectedBg: "blue"
        , interactive: true
        , label: "Robots - 'r' to focus"
        , border: {type: "line", fg: "cyan"}
        , columnSpacing: 1
        , columnWidth: [30, 20]
    });
    const log = grid.set(8, 0, 4, 12, Contrib.log, { fg: "green"
      , selectedFg: "green"
      , label: "Log"});
   
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
     RefreshData(authTokens).then( (data) => {
       DrawUi(data);
       Logger.Log.Info("refreshed data...");
     });
   });

   deviceTable.rows.on("select", (data, index) => {
       const device : Devices.Device = devicesLookup[index];
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
       const group : Groups.Group = groupsLookup[index];
       Logger.Log.Info(`selected group with id ${group.Id}`);
       Groups.toggleGroupState(authTokens, group);
   });
   
   robotTable.rows.on("select", (data, index) => {
       const robot : Robots.Robot = robotsLookup[index];
       Logger.Log.Info(`selected robot with id ${robot.Id}`);
       Robots.toggleRobotState(authTokens, robot);
   });

   const DrawUi = (data) => {
        const deviceData = [];
        data[0].forEach((device) => {
            deviceData.push(device.ToDisplayArray());
        });
        deviceTable.setData({headers: ["Name", "Type", "Status", "Battery"], data: deviceData});
        const robotData = [];
        data[1].forEach((robot) => {
            robotData.push(robot.ToDisplayArray());
        });
        robotTable.setData({headers: ["Name", "Status"], data: robotData});
        const groupData = [];
        data[2].forEach((group) => {
            groupData.push(group.ToDisplayArray());
        });
        groupTable.setData({headers: ["Name", "Status"], data: groupData});
        screen.render();
   };
   RefreshData(authTokens).then((data) => {
       DrawUi(data);
   });
}

const RefreshData = (authTokens: Auth.IAuthResult) => {
    return new Promise<[Array<Devices.Device>, Array<Robots.Robot>, Array<Groups.Group>]>( (resolve, _) => {
        Async.parallel({
            devices: async (cb) => {
                Devices.devicesAsync(authTokens).then((devices) => {
                    Logger.Log.Info(`obtained ${devices.length} devices...`);
                    devicesLookup = devices;
                    cb(null, devices);
                });
            },
            robots: async (cb) => {
                Robots.robotsAsync(authTokens).then((robots) => {
                    Logger.Log.Info(`obtained ${robots.length} robots...`);
                    robotsLookup = robots;
                    cb(null, robots);
                });
            },
            groups: async (cb) => {
                Groups.groupsAsync(authTokens).then((groups) => {
                    Logger.Log.Info(`obtained ${groups.length} groups...`);
                    groupsLookup = groups;
                    cb(null, groups);
                });
            }
    }, (err, results) => {
            // this is to satsify ts' typing checks
            const 
                devices : Array<Devices.Device> = results["devices"],
                robots  : Array<Robots.Robot>   = results["robots"],
                groups  : Array<Groups.Group>   = results["groups"];
            resolve([devices, robots, groups]);
        });
    });
};
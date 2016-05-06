"use strict";
const emitter = require("events"), util = require("util");
function LogEmitter() {
    emitter.call(this);
}
util.inherits(LogEmitter, emitter);
exports.logEmitter = new LogEmitter();
(function (LogLevel) {
    LogLevel[LogLevel["Info"] = 0] = "Info";
    LogLevel[LogLevel["Warn"] = 1] = "Warn";
    LogLevel[LogLevel["Error"] = 2] = "Error";
})(exports.LogLevel || (exports.LogLevel = {}));
var LogLevel = exports.LogLevel;
class Logger {
    Info(message) { this.log(LogLevel.Info, message); }
    Warn(message) { this.log(LogLevel.Warn, message); }
    Error(message) { this.log(LogLevel.Error, message); }
    log(level, message) {
        exports.logEmitter.emit("log", `${(new Date).toISOString()} - ${LogLevel[level]} - ${message}`);
    }
}
exports.Log = new Logger();

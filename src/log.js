"use strict";
var emitter = require("events"), util = require("util");
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
var Logger = (function () {
    function Logger() {
    }
    Logger.prototype.Info = function (message) { this.log(LogLevel.Info, message); };
    Logger.prototype.Warn = function (message) { this.log(LogLevel.Warn, message); };
    Logger.prototype.Error = function (message) { this.log(LogLevel.Error, message); };
    Logger.prototype.log = function (level, message) {
        exports.logEmitter.emit("log", (new Date).toISOString() + " - " + LogLevel[level] + " - " + message);
    };
    return Logger;
}());
exports.Log = new Logger();

"use strict";
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
        console.log(`${(new Date).toISOString()} - ${LogLevel[level]} - ${message}`);
    }
}
exports.Log = new Logger();
//# sourceMappingURL=log.js.map
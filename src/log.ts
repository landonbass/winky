"use strict";

const emitter = require("events"),
      util    = require("util");

function LogEmitter() {
    emitter.call(this);
}

util.inherits(LogEmitter, emitter);

export const logEmitter = new LogEmitter();

export enum LogLevel {
    Info,
    Warn,
    Error
}

export interface ILog {
    Info(message: string): void;
    Warn(message: string): void;
    Error(message: string): void;
}

class Logger implements ILog {
    public Info(message: string) { this.log(LogLevel.Info, message); }
    public Warn(message: string) { this.log(LogLevel.Warn, message); }
    public Error(message: string) { this.log(LogLevel.Error, message); }
    private log(level: LogLevel, message: string) {
        logEmitter.emit("log",`${(new Date).toISOString()} - ${LogLevel[level]} - ${message}`);
    }
}

export const Log = new Logger();


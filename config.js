"use strict";
const Fs = require("fs");
const configPath = "./config.json";
exports.data = JSON.parse(Fs.readFileSync(configPath, "UTF-8"))[process.env.NODE_ENV || "dev"];
//# sourceMappingURL=config.js.map
"use strict";

import * as Fs from "fs";

const configPath = "./config.json";

export const data = JSON.parse(Fs.readFileSync(configPath, "UTF-8"))[process.env.NODE_ENV || "dev"];
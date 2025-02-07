"use strict";

const electron = require("electron");
const winston = require("winston");
const dataAccess = require("./common/data-access.js");
const app = electron.app || firebotAppDetails;
//const config = winston.config;
//const Sentry = require("winston-raven-sentry");
const fs = require("fs-extra");

const LOG_FOLDER = dataAccess.getPathInUserData("/logs");

const settingsfile = dataAccess.getJsonDbInUserData("/global-settings");
let rotateFileLogLevel = "info";

let debugMode = false;
try {
    debugMode = settingsfile.getData("/settings/debugMode");
} catch (err) {} //eslint-disable-line no-empty
if (debugMode === true) {
    rotateFileLogLevel = "debug";
}

//make sure log path exists
if (!fs.existsSync(LOG_FOLDER)) {
    fs.mkdirSync(LOG_FOLDER);
}

/*let sentryTransport = new Sentry({
    dsn:
    "https://c4ba7c4b47814f8e88886ca08414aad4:a960630da816494fbe756e61116812e8@sentry.io/285894",
    level: "error",
    install: false,
    tags: {
        version: app.getVersion()
    }
});*/

const pad = (subject, length, padText) => (subject + '').padStart(length, padText + '');

const rotateFileTransport = new (require("winston-daily-rotate-file"))({
    level: rotateFileLogLevel,
    filename: LOG_FOLDER + "/log",
    datePattern: "yyyy-MM-dd.",
    prepend: true,
    json: false,
    maxDays: 7,
    humanReadableUnhandledException: true,
    label: "v" + app.getVersion(),
    prettyPrint: true,

    // YYYY-MM-DD hh:nn:ss
    timestamp: function() {
        const currentDate = new Date();

        const year = currentDate.getUTCFullYear() + '';
        const month = pad(currentDate.getUTCMonth() + 1, 2, 0);
        const day = pad(currentDate.getDate(), 2, 0);

        const hour = pad(currentDate.getUTCHours(), 2, 0);
        const minute = pad(currentDate.getUTCMinutes(), 2, 0);
        const seconds = pad(currentDate.getUTCSeconds(), 2, 0);
        const milliseconds = pad(currentDate.getUTCMilliseconds(), 4, 0);

        return `${year}-${month}-${day} ${hour}:${minute}:${seconds}.${milliseconds}`;
    }
});

const consoleTransport = new winston.transports.Console({
    level: "silly",
    prettyPrint: true,
    colorize: true
});

const logger = new winston.Logger({
    level: "silly",
    exitOnError: false,
    transports: [consoleTransport, rotateFileTransport]
});

// uncaught exception - log the error
process.on("uncaughtException", logger.error); //eslint-disable-line no-console
process.on("unhandledRejection", error => logger.error("Unhandled promise rejection", error));

// Export
module.exports = logger;

// ### function serialize (obj, key)
// #### @obj {Object|literal} Object to serialize
// #### @key {string} **Optional** Optional key represented by obj in a larger object
// Performs simple comma-separated, `key=value` serialization for Loggly when
// logging to non-JSON inputs.
function serialize(obj, key) { //eslint-disable-line no-unused-vars
    // symbols cannot be directly casted to strings
    if (typeof key === "symbol") {
        key = key.toString();
    }
    if (typeof obj === "symbol") {
        obj = obj.toString();
    }

    if (obj === null) {
        obj = "null";
    } else if (obj === undefined) {
        obj = "undefined";
    } else if (obj === false) {
        obj = "false";
    }

    if (typeof obj !== "object") {
        return key ? key + "=" + obj : obj;
    }

    if (obj instanceof Buffer) {
        return key ? key + "=" + obj.toString("base64") : obj.toString("base64");
    }

    let msg = "",
        keys = Object.keys(obj),
        length = keys.length;

    for (let i = 0; i < length; i++) {
        if (Array.isArray(obj[keys[i]])) {
            msg += keys[i] + "=[";

            for (let j = 0, l = obj[keys[i]].length; j < l; j++) {
                msg += serialize(obj[keys[i]][j]);
                if (j < l - 1) {
                    msg += ", ";
                }
            }

            msg += "]";
        } else if (obj[keys[i]] instanceof Date) {
            msg += keys[i] + "=" + obj[keys[i]];
        } else {
            msg += serialize(obj[keys[i]], keys[i]);
        }

        if (i < length - 1) {
            msg += ", ";
        }
    }

    return msg;
}

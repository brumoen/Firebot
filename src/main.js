"use strict";
const { app } = require("electron");

const logger = require("./backend/logwrapper");
const secretsManager = require("./backend/secrets-manager");
const { handleSquirrelEvents } = require("./backend/app-management/squirrel-events");
const {
    whenReady,
    windowsAllClosed,
    willQuit,
    secondInstance
} = require("./backend/app-management/electron/electron-events");

logger.info("Starting Firebot...");

if (!secretsManager.testSecrets()) {
    logger.info("...Testing for secrets failed [REMOVE LATER]");
    app.quit();
    return;
}

logger.info("...Secrets tested [REMOVE LATER]");

// Handle any squirrel install/update events
// returns false if the rest of app execution should stop.
if (!handleSquirrelEvents()) {
    return;
}

logger.info("...Squirrel handled [REMOVE LATER]");

// ensure only a single instance of the app runs
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    logger.info("...Failed to get single instance lock [REMOVE LATER]");
    app.quit();
    return;
}

logger.info("...Single instance lock acquired [REMOVE LATER]");

// Setup app listeners
app.on('second-instance', secondInstance);
app.on("window-all-closed", windowsAllClosed);
app.on("will-quit", willQuit);
app.whenReady().then(whenReady).catch(error => {
    logger.info("Error on when ready step [REMOVE LATER]", error);
    app.quit();
});

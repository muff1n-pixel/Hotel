import SetupManager from "./Setup/SetupManager.js";

if(process.argv.some((arg) => arg.toLowerCase() === "--setup") || SetupManager.shouldSetup()) {
    console.log("Configuration files are missing, proceeding with setup...");

    console.log("");

    SetupManager.startSetup();
}

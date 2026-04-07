import { exec } from "child_process";
import SetupManager from "./Setup/SetupManager.js";
import open from "open";

if(process.argv.some((arg) => arg.toLowerCase() === "--setup") || SetupManager.shouldSetup()) {
    console.log("Configuration files are missing, proceeding with setup...");

    console.log("");

    SetupManager.startSetup();
}
else {
    console.log("Starting web server");

    exec(`cd ../../packages/web && npm run start`);

    console.log("Starting game server");

    exec(`cd ../../packages/server && npm run start`);

    console.log("");

    console.log("Server is now running on http://localhost:80");
}

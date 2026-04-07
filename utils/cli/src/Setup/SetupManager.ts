import { existsSync } from "fs";
import path from "path";
import SetupDatabase from "./SetupDatabase.js";
import SetupProtoc from "./SetupProtoc.js";
import SetupAssets from "./SetupAssets.js";
import { confirm } from "@inquirer/prompts";
import { execSync } from "child_process";

export default class SetupManager {
    public static shouldSetup() {
        const packages = ["server", "web"].map((name) => path.join("../../packages/", name));

        if(packages.some((directory) => !existsSync(path.join(directory, "config.json")))) {
            return true;
        }

        return false;
    }

    public static async startSetup() {
        if(process.argv.some((arg) => arg.toLowerCase() === "--setup") || !(await SetupDatabase.hasDatabaseConnection())) {
            console.log("1. You need to have a MySQL server, proceed with entering the credentials to connect:");

            await SetupDatabase.setupDatabaseConnection();

            console.log("");

            console.log("1.a Setting up a barebones database schema...");

            await SetupDatabase.setupDatabaseSchema();

            SetupDatabase.saveCredentials();
        }
        else {
            console.log("1. Database connection succeeded, skipping database connection setup...");
        }

        console.log("");

        if(!SetupProtoc.hasProtocBinary() || await confirm({ message: "You already have protoc binaries, do you want to download them anyway?" })) {
            console.log("2. You need to have the Protocol Buffers compiler (protoc), installing...");
    
            await SetupProtoc.setup();
        }
        else {
            console.log("2. Protocol Buffers compiler is installed, skipping...");
        }

        console.log("");

        if(!SetupAssets.hasAssets() || await confirm({ message: "You already have assets, do you want to download them anyway?" })) {
            console.log("3. Assets do not exist locally, downloading...");

            await SetupAssets.setup();
        }
        else {
            console.log("3. Assets already exist, skipping...");
        }

        console.log("");

        console.log("4. Building packages...");

        console.log("4a. Generating events...");

        execSync("cd ../../packages/events && npm i && npm run generate");

        console.log("4b. Building shared package...");

        execSync("cd ../../packages/shared && npm i && npm run build");

        console.log("4c. Building game package...");

        execSync("cd ../../packages/game && npm i && npm run build && npm run build:lib");

        console.log("4d. Building web package...");

        execSync("cd ../../packages/web && npm i && npm run build");

        console.log("4e. Building server package...");

        execSync("cd ../../packages/server && npm i && npm run build");

        console.log("4f. Executing migration scripts...");

        execSync("cd ../../packages/server && npm run migrate");

        console.log("");

        console.log("Everything is set up! Run 'npm run start' to start the server.");
    }
}

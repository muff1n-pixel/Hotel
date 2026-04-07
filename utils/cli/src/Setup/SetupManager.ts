import { existsSync } from "fs";
import path from "path";
import SetupDatabase from "./SetupDatabase.js";
import SetupProtoc from "./SetupProtoc.js";
import SetupAssets from "./SetupAssets.js";

export default class SetupManager {
    public static shouldSetup() {
        const packages = ["server", "web", "game"].map((name) => path.join("../../packages/", name));

        if(packages.some((directory) => !existsSync(path.join(directory, "config.json")))) {
            return true;
        }

        return false;
    }

    public static async startSetup() {
        if(process.argv.some((arg) => arg.toLowerCase() === "--setup") || !SetupDatabase.hasDatabaseConnection()) {
            console.log("1. You need to have a MySQL server, proceed with entering the credentials to connect:");

            await SetupDatabase.setupDatabaseConnection();

            console.log("");

            console.log("1.a Setting up a barebones database schema...");

            await SetupDatabase.setupDatabaseSchema();
        }
        else {
            console.log("1. Database connection succeeded, skipping database connection setup...");
        }

        console.log("");

        if(!SetupProtoc.hasProtocBinary()) {
            console.log("2. You need to have the Protocol Buffers compiler (protoc), installing...");
    
            await SetupProtoc.setup();
        }
        else {
            console.log("2. Protocol Buffers compiler is installed, skipping...");
        }

        if(!SetupAssets.hasAssets()) {
            await SetupAssets.setup();
        }


        console.log("Done!");
    }
}

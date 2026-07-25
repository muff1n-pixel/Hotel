import { parse } from "dotenv";
import { stringify } from "ini";
import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";

export default class EnvironmentSettings {
    public static read() {
        if(existsSync(".env")) {
            const content = readFileSync(".env", {
                encoding: "utf-8"
            });

            parse(content);

            this.updateFallbackPaths();

            return true;
        }

        this.updateFallbackPaths();

        return false;
    }

    private static updateFallbackPaths() {
        process.env.ASSETS_OUTPUT_PATH ??= path.join("..", "..", "assets");
        process.env.FURNITURE_INPUT_PATH ??= path.join("..", "swf-extract", "assets", "furniture");
        process.env.ASSETS_INPUT_PATH ??= path.join("..", "swf-extract", "assets");

        this.write();
    }

    public static write() {
        const content = stringify({
            ASSETS_OUTPUT_PATH: process.env.ASSETS_OUTPUT_PATH,
            FURNITURE_INPUT_PATH: process.env.FURNITURE_INPUT_PATH,
            ASSETS_INPUT_PATH: process.env.ASSETS_INPUT_PATH,
        });

        writeFileSync(".env", content, {
            encoding: "utf-8"
        });
    }
}

import { input, select } from "@inquirer/prompts";
import EnvironmentSettings from "../core/EnvironmentSettings.ts";
import { runApplication } from "../index.ts";

export default class ChangeEnvironmentSettingsAction {
    public async run() {
        const option = await select({
            message: "Change environment settings",
            choices: [
                {
                    name: "Change furniture assets input path",
                    value: "FURNITURE_INPUT_PATH",
                    description: "Set the path to where the furniture SWF assets folder is located.",
                },
                {
                    name: "Change assets input path",
                    value: "ASSETS_INPUT_PATH",
                    description: "Set the path to where the general SWF assets folder is located.",
                },
                {
                    name: "Change assets output path",
                    value: "ASSETS_OUTPUT_PATH",
                    description: "Set the path to where the assets folder is located.",
                }
            ],
        });

        switch(option) {
            case "FURNITURE_INPUT_PATH":
            case "ASSETS_OUTPUT_PATH":
            case "ASSETS_INPUT_PATH": {
                const path = await input({
                    message: "Path to folder:",
                    default: process.env[option]
                });

                process.env[option] = path;

                EnvironmentSettings.write();

                await runApplication();

                break;
            }
        }
    }
}

import { confirm, input, select } from "@inquirer/prompts";
import { PromisePool } from "@supercharge/promise-pool";
import { existsSync, mkdirSync, readdirSync, rmSync } from "fs";
import path from "path";
import FurnitureExtraction from "../extractions/FurnitureExtraction.ts";
import SwfExtraction from "../extractions/SwfExtraction.ts";

export default class ExtractAction {
    public async run() {
        const path = await select({
            message: "Choose asset path",
            choices: [
                {
                    name: "ASSETS_INPUT_PATH",
                    value: process.env.ASSETS_INPUT_PATH!,
                    description: process.env.ASSETS_INPUT_PATH!,
                },
                {
                    name: "FURNITURE_INPUT_PATH",
                    value: process.env.FURNITURE_INPUT_PATH!,
                    description: process.env.FURNITURE_INPUT_PATH!,
                },
                {
                    name: "FIGURE_INPUT_PATH",
                    value: process.env.FIGURE_INPUT_PATH!,
                    description: process.env.FIGURE_INPUT_PATH!,
                },
            ],
        });

        await this.handlePath(path);
    }

    private async handlePath(path: string) {
        const method = await select({
            message: "Extract asset",
            choices: [
                {
                    name: "Enter asset name",
                    value: "assetName",
                    description: "Enter one or more asset names to extract.",
                },
                {
                    name: "Extract assets including input",
                    value: "includes",
                    description: "Search for asset names containing the input to extract.",
                },
                {
                    name: "Extract assets starting with input",
                    value: "startsWith",
                    description: "Search for asset names starting with the input to extract.",
                }
            ],
        });

        await this.handleMethod(path, method);
    }

    private async handleMethod(assetsPath: string, method: "assetName" | "includes" | "startsWith") {
        switch(method) {
            case "assetName": {
                const assetNames = await input({
                    message: "Enter asset names separated by spaces:",
                    default: "rare_dragonlamp",
                    required: true,
                });

                await this.handleAssetNames(assetsPath, assetNames.split(' '));

                break;
            }

            case "startsWith":
            case "includes": {
                const assetName = await input({
                    message: "Enter the input to filter the furniture with:",
                    default: "rare",
                    required: true,
                });

                const assetNames = readdirSync(assetsPath, { withFileTypes: true })
                    .filter((file) => file.isFile() && path.basename(file.name).endsWith(".swf") && path.basename(file.name)[method](assetName))
                    .map((file) => path.basename(file.name, ".swf"));

                console.log("? Furniture found matching filter:");
                console.log(assetNames.map((assetName) => `?\t${assetName}`).join('\n'))

                const confirmation = await confirm({
                    message: "Extract the following furniture?"
                });

                if(confirmation) {
                    await this.handleAssetNames(assetsPath, assetNames);
                }

                break;
            }
        }
    }

    private async handleAssetNames(assetsPath: string, assetNames: string[]) {
        await PromisePool
            .withConcurrency(30)
            .for(assetNames)
            .process(async (assetName) => {
                try {
                    console.time("> Extracting " + assetName);

                    const assetPath = path.join(assetsPath, `${assetName}.swf`);
                    const tempPath = path.join("temp", assetName);
                    
                    if(existsSync(tempPath)) {
                        rmSync(tempPath, {
                            force: true,
                            recursive: true
                        });
                    }
            
                    mkdirSync(tempPath, {
                        recursive: true
                    });

                    const swfExtraction = new SwfExtraction(assetName, assetPath, tempPath);

                    await swfExtraction.execute();
                 
                    console.timeEnd("> Extracting " + assetName);
                }
                catch(error) {
                    console.error(error);
                }
            })
            .catch((error) => console.error(error));
    }
}

import { confirm, input, select } from "@inquirer/prompts";
import { PromisePool } from "@supercharge/promise-pool";
import { readdirSync } from "fs";
import path from "path";
import FurnitureExtraction from "../extractions/FurnitureExtraction.ts";
import FurnitureDataExtraction from "../extractions/FurnitureDataExtraction.ts";

export default class ConvertFurnitureAction {
    public async run() {
        const method = await select({
            message: "Convert furniture",
            choices: [
                {
                    name: "Enter asset name",
                    value: "assetName",
                    description: "Enter one or more asset names to extract.",
                },
                {
                    name: "Extract furniture including input",
                    value: "includes",
                    description: "Search for asset names containing the input to extract.",
                },
                {
                    name: "Extract furniture starting with input",
                    value: "startsWith",
                    description: "Search for asset names starting with the input to extract.",
                }
            ],
        });


        await this.handleMethod(method);
    }

    private async handleMethod(method: "assetName" | "includes" | "startsWith") {
        switch(method) {
            case "assetName": {
                const assetNames = await input({
                    message: "Enter asset names separated by spaces:",
                    default: "rare_dragonlamp",
                    required: true,
                });

                await this.handleAssetNames(assetNames.split(' '));

                break;
            }

            case "startsWith":
            case "includes": {
                const assetName = await input({
                    message: "Enter the input to filter the furniture with:",
                    default: "rare",
                    required: true,
                });

                const assetNames = readdirSync(process.env.FURNITURE_INPUT_PATH!, { withFileTypes: true })
                    .filter((file) => file.isFile() && path.basename(file.name).endsWith(".swf") && path.basename(file.name)[method](assetName))
                    .map((file) => path.basename(file.name, ".swf"));

                console.log("? Furniture found matching filter:");
                console.log(assetNames.map((assetName) => `?\t${assetName}`).join('\n'))

                const confirmation = await confirm({
                    message: "Extract the following furniture?"
                });

                if(confirmation) {
                    await this.handleAssetNames(assetNames);
                }

                break;
            }
        }
    }

    private async handleAssetNames(assetNames: string[]) {
        const furnitureDataExtraction = new FurnitureDataExtraction();

        await PromisePool
            .withConcurrency(30)
            .for(assetNames)
            .process(async (assetName) => {
                try {
                    console.time("> Extracting " + assetName);

                    const extraction = new FurnitureExtraction(assetName, furnitureDataExtraction);

                    await extraction.execute();
                 
                    console.timeEnd("> Extracting " + assetName);
                }
                catch(error) {
                    console.error(error);
                }
            })
            .catch((error) => console.error(error));
    }
}

import { XMLParser } from "fast-xml-parser";
import { readFileSync } from "node:fs";

export default class FurnitureDataExtraction {
    private furniture: any[];

    constructor() {
        const content = readFileSync("./furniture.json", {
            encoding: "utf-8"
        });

        this.furniture = JSON.parse(content);
    }

    private getFurnitureData(assetName: string) {
        return this.furniture.find((row) => row.type.split('*')[0] === assetName);
    }

    public async execute(assetName: string) {
        const parser = new XMLParser({
            ignoreAttributes: false
        });

        const document = parser.parse(readFileSync("furnidata2.xml", { encoding: "utf-8" }), false);
        const furnitureData = this.getFurnitureData(assetName);

        let furniTypes = document["furnidata"]["roomitemtypes"]["furnitype"].filter((furniType: any) => furniType["@_classname"].split('*')[0] === assetName);
        let isWallFurniture = false;

        if (!furniTypes.length) {
            furniTypes = document["furnidata"]["wallitemtypes"]["furnitype"].filter((furniType: any) => furniType["@_classname"].split('*')[0] === assetName);
            
            if(furniTypes.length) {
                isWallFurniture = true;
            }
        }

        if (!furniTypes.length) {
            console.error("Failed to find furni type in furnidata for " + assetName);

            furniTypes = [
                {
                    "@_classname": assetName
                }
            ];
        }

        return await Promise.all(furniTypes.map(async (furniType: any) => {
            const color = furniType["@_classname"].split('*')[1];

            const hasDescription = furniType["description"] && !furniType["description"].endsWith(" desc");

            let customParams: unknown[] | null = (furniType["customparams"]) ? (furniType["customparams"].toString().split(',').map((value: string) => parseFloat(value))) : (null);

            const stackable = furnitureData?.stackable ?? false;
            const inventoryStackable = furnitureData?.inventory_stackable ?? false;
            const giftable = furnitureData?.giftable ?? false;
            const recyclable = furnitureData?.recyclable ?? false;
            const sellable = furnitureData?.sellable ?? false;

            return {
                name: furniType["name"],
                description: hasDescription && furniType["description"],

                color: (color) ? (parseInt(color)) : (undefined),

                placement: (isWallFurniture) ? ("wall") : ("floor"),
                defaultDirection: (furniType["defaultdir"]) ? (parseInt(furniType["defaultdir"])) : (undefined),

                category: furniType["category"],
                interactionType: furnitureData?.interaction_type ?? "default",

                flags: {
                    stackable,
                    sitable: (furniType["cansiton"] ?? '0') === '1',
                    layable: (furniType["canlayon"] ?? '0') === '1',
                    walkable: (furniType["canstandon"] ?? '1') === '1',
                    giftable,
                    tradable: (furniType["tradable"] ?? '1') === '1',
                    recyclable,
                    sellable,
                    inventoryStackable
                },

                customParams
            };
        }));
    }
}
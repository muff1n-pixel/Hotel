import { XMLParser } from "fast-xml-parser";
import { readFileSync } from "node:fs";
import sqlite3 from "sqlite3";

export default class FurnitureDataExtraction {
    private readonly assetName: string;
    private readonly database: sqlite3.Database;

    constructor(assetName: string) {
        this.assetName = assetName;

        this.database = new sqlite3.Database(":memory:");
    }

    public async prepare() {
        await new Promise<void>((resolve) => {
            this.database.serialize(() => {
                this.database.exec(readFileSync("./furniture.sql", {encoding: "utf-8"}), () => resolve());
            })
        });
    }

    public async execute() {
        const parser = new XMLParser({
            ignoreAttributes: false
        });

        const document = parser.parse(readFileSync("furnidata2.xml", { encoding: "utf-8" }), false);

        let furniTypes = document["furnidata"]["roomitemtypes"]["furnitype"].filter((furniType: any) => furniType["@_classname"].split('*')[0] === this.assetName);
        let isWallFurniture = false;

        if (!furniTypes.length) {
            furniTypes = document["furnidata"]["wallitemtypes"]["furnitype"].filter((furniType: any) => furniType["@_classname"].split('*')[0] === this.assetName);
            
            if(furniTypes.length) {
                isWallFurniture = true;
            }
        }

        if (!furniTypes.length) {
            console.error("Failed to find furni type in furnidata for " + this.assetName);

            furniTypes = [
                {
                    "@_classname": this.assetName
                }
            ];
        }

        return await Promise.all(furniTypes.map(async (furniType: any) => {
            const color = furniType["@_classname"].split('*')[1];

            const hasDescription = furniType["description"] && !furniType["description"].endsWith(" desc");

            const result: any = await new Promise((resolve) => {
                this.database.get("SELECT * FROM items_base WHERE item_name = '" + furniType["@_classname"] + "' LIMIT 1", (error, row) => {
                    resolve(row);
                });
            });

            let customParams: unknown[] | null = (furniType["customparams"]) ? (furniType["customparams"].toString().split(',').map((value: string) => parseFloat(value))) : (null);

            if (result?.interaction_type === "vendingmachine" && result?.vending_ids) {
                customParams = result.vending_ids.split(',').map((id: string) => parseInt(id));
            }

            return {
                name: furniType["name"],
                description: hasDescription && furniType["description"],

                color: (color) ? (parseInt(color)) : (undefined),

                placement: (isWallFurniture) ? ("wall") : ("floor"),
                defaultDirection: (furniType["defaultdir"]) ? (parseInt(furniType["defaultdir"])) : (undefined),

                category: furniType["category"],
                interactionType: result?.interaction_type ?? "default",

                flags: {
                    stackable: (result?.allow_stack ?? 1) === 1,
                    sitable: (result?.allow_sit ?? 0) === 1,
                    layable: (result?.allow_lay ?? 0) === 1,
                    walkable: (result?.allow_walk ?? 0) === 1,
                    giftable: (result?.allow_gift ?? 1) === 1,
                    tradable: (result?.allow_trade ?? 1) === 1,
                    recyclable: (result?.allow_recycle ?? 1) === 1,
                    sellable: (result?.allow_marketplace_sell ?? 1) === 1,
                    inventoryStackable: (result?.allow_inventory_stack ?? 1) === 1
                },

                customParams
            };
        }));
    }
}
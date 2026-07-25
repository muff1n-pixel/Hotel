import { XMLParser } from "fast-xml-parser";
import { readFileSync } from "node:fs";
import type { FurnitureAsset } from "../../../../../packages/game/src/Client/Interfaces/Furniture/FurnitureAssets.ts"

export default class ManifestAssetsExtraction {
    private readonly filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    public async execute() {
        const parser = new XMLParser({ ignoreAttributes: false });
        const document = parser.parse(readFileSync(this.filePath, { encoding: "utf-8" }), true);

        let assets: any[] = document.assets.asset;

        /*const assetNames = assets.map((asset: any) => asset["@_name"]);
        const has32Assets = assetNames.some((name: string) =>
            name.includes("_32_") || name.endsWith("_32")
        );

        if (!has32Assets && flags.some((flag) => flag === "--downscale")) {
            console.log("Adding downscaled 32 sprites.");

            const duplicated: any[] = [];

            for (const asset of assets) {
                const clone = { ...asset };

                let newName = asset["@_name"].replace(/_64_/g, "_32_");

                if (newName === asset["@_name"]) {
                    newName = asset["@_name"] + "_32";
                }

                clone["@_name"] = newName;

                if (clone["@_x"] !== undefined) {
                    clone["@_x"] = Math.round(parseFloat(clone["@_x"]) / 2).toString();
                }

                if (clone["@_y"] !== undefined) {
                    clone["@_y"] = Math.round(parseFloat(clone["@_y"]) / 2).toString();
                }

                if (clone["@_source"]) {
                    clone["@_source"] = clone["@_source"].replace(/_64_/g, "_32_");
                }

                duplicated.push(clone);
            }

            assets = [...assets, ...duplicated];
        }*/

        return assets.map((asset: any) => ({
            name: asset["@_name"],
            x: parseFloat(asset["@_x"]) * -1,
            y: parseFloat(asset["@_y"]) * -1,
            flipHorizontal: asset["@_flipH"] === '1',
            source: asset["@_source"],
            
            usesPalette: (asset["@_usesPalette"] === '1')
        } satisfies FurnitureAsset));
    }
}

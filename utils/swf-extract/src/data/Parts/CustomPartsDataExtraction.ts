import type { SwfExtractionCollection } from "../../swf/SwfExtraction.ts";
import type { FurniturePalette } from "../../../../../packages/game/src/Client/Interfaces/Furniture/FurniturePalette.ts";
import { XMLParser } from "fast-xml-parser";
import { readFileSync } from "node:fs";
import { getValueAsArray } from "../DataCreation.ts";

export default class CustomPartsDataExtraction {
    public static getAssetParts(collection: SwfExtractionCollection): FurniturePalette[] {
        if (!collection.data.assets) throw new Error("Assets data doesn't exist.");
    
        const parser = new XMLParser({ ignoreAttributes: false });
        const document = parser.parse(readFileSync(collection.data.assets, { encoding: "utf-8" }), true);
    
        return getValueAsArray(document.assets.custompart).map((custompart: any) => {
            return {
                id: parseInt(custompart["@_id"]),
                source: custompart["@_source"],

                tags: custompart["@_tags"].split(',')
            };
        });
    }
}

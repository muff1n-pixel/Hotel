import { XMLParser } from "fast-xml-parser";
import { readFileSync } from "node:fs";
import { getValueAsArray } from "../../helpers.ts";

export default class ManifestAssetPartsExtraction {
    private readonly filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    public execute() {
        const parser = new XMLParser({ ignoreAttributes: false });
        const document = parser.parse(readFileSync(this.filePath, { encoding: "utf-8" }), true);
    
        return getValueAsArray(document.assets.custompart).map((custompart: any) => {
            return {
                id: parseInt(custompart["@_id"]),
                source: custompart["@_source"],

                tags: custompart["@_tags"].split(',')
            };
        });
    }
}

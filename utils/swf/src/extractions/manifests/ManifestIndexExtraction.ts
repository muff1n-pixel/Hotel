import { XMLParser } from "fast-xml-parser";
import { readFileSync } from "node:fs";
import type { FurnitureIndex } from "../../../../../packages/game/src/Client/Interfaces/Furniture/FurnitureIndex.ts"

export default class ManifestIndexExtraction {
    private readonly filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    public async execute() {
        const parser = new XMLParser({ ignoreAttributes: false });
        const document = parser.parse(readFileSync(this.filePath, { encoding: "utf-8" }), true);

        return {
            type: document["object"]["@_type"],
            visualization: document["object"]["@_visualization"],
            logic: document["object"]["@_logic"],
        } satisfies FurnitureIndex;
    }
}

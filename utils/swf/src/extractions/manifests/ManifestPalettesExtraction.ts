import { XMLParser } from "fast-xml-parser";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import type { FurnitureIndex } from "../../../../../packages/game/src/Client/Interfaces/Furniture/FurnitureIndex.ts"
import { getValueAsArray } from "../../helpers.ts";
import type { SwfExtractionResult } from "../SwfExtraction.ts";
import path from "node:path";
import type { FurniturePalette } from "../../../../../packages/game/src/Client/Interfaces/Furniture/FurniturePalette.ts";

export default class ManifestPalettesExtraction {
    private readonly swfExtractionResult: SwfExtractionResult;

    constructor(swfExtractionResult: SwfExtractionResult) {
        this.swfExtractionResult = swfExtractionResult;
    }

    public execute(outputPath: string) {
        if(!this.swfExtractionResult.data.assets) {
            throw new Error("Assets does not exist.");
        }

        const parser = new XMLParser({ ignoreAttributes: false });
        const document = parser.parse(readFileSync(this.swfExtractionResult.data.assets, { encoding: "utf-8" }), true);

        const palettes = getValueAsArray(document.assets.palette).map((palette: any) => {
            return {
                id: parseInt(palette["@_id"]),
                source: palette["@_source"],

                color1: '#' + palette["@_color1"].toUpperCase(),
                color2: (palette["@_color2"])?('#' + palette["@_color2"].toUpperCase()):(undefined),

                master: palette["@_master"] === "true",

                tags: (palette["@_tags"])?(palette["@_tags"].split(',')):(undefined),

                breed: (palette["@_breed"])?(parseInt(palette["@_breed"])):(undefined),
                colorTag: (palette["@_colortag"])?(parseInt(palette["@_colortag"])):(undefined),
            };
        });

        this.extractFilePalettes(outputPath, palettes);

        return palettes;
    }

    public extractFilePalettes(basePath: string, palettes: FurniturePalette[]) {
        const outputPath = this.getOutputPath(basePath);

        for(const palette of palettes) {
            const filePath = this.swfExtractionResult.extra.find((extra) => extra.endsWith(palette.source + ".xml"));

            if(!filePath) {
                console.error("Could not find palette file source for " + palette.source);

                continue;
            }

            const result = this.getPaletteContent(filePath);

            writeFileSync(path.join(outputPath, `${palette.source}.json`), JSON.stringify(result, undefined, 2));
        }
    }

    private getOutputPath(basePath: string) {
        const outputPath = path.join(basePath, "palettes");
        
        if(existsSync(outputPath)) {
            rmSync(outputPath, {
                force: true,
                recursive: true
            });
        }

        mkdirSync(outputPath, {
            recursive: true
        });

        return outputPath;
    }

    private getPaletteContent(filePath: string) {
        const buffer = readFileSync(filePath);

        let readBytes = 0;
        let currentBytes: string[] = [];
        let currentSection = 0;

        const colors: string[] = [];

        for (let index = 0; index < buffer.length; index++) {
            const hex = buffer[index]!.toString(16).padStart(2, "0");
            
            currentBytes.push(hex);

            if(currentBytes.length === 3) {
                colors.push(currentBytes.join('').toUpperCase());

                currentBytes = [];
            }
        }

        return colors;
    }
}

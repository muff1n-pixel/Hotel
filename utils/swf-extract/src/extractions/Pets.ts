import path from "node:path";
import { extractSwf } from "../swf/SwfExtraction.ts";
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createSpritesheet } from "../spritesheet/SpritesheetCreation.ts";
import { createAssetsData, createFurnitureData, createIndexData, createLogicData, createVisualizationData } from "../data/DataCreation.ts";
import type { FurnitureData } from "../../../../packages/game/src/Client/Interfaces/Furniture/FurnitureData.ts";
import PaletteDataExtraction from "../data/Palettes/PaletteDataExtraction.ts";
import CustomPartsDataExtraction from "../data/Parts/CustomPartsDataExtraction.ts";

export default async function extractPets(assetNames: string[]) {
    for(const assetName of assetNames) {
        await extractSwf(assetName, path.join("assets", "pets", `${assetName}.swf`));

        if(existsSync(path.join("temp", assetName))) {
            rmSync(path.join("temp", assetName), {
                force: true,
                recursive: true
            });
        }

        const swfCollection = await extractSwf(assetName, path.join("assets", "pets", `${assetName}.swf`));

        if(!swfCollection.images.length) {
            console.log("There's no images in the SWF collection.");

            return;
        }

        const spritesheet = await createSpritesheet(assetName, swfCollection.images);

        const outputPath = path.join("..", "..", "assets", "pets", assetName);
        
        if(existsSync(outputPath)) {
            rmSync(outputPath, {
                force: true,
                recursive: true
            });
        }

        mkdirSync(outputPath, {
            recursive: true
        });

        copyFileSync(path.join("temp", assetName, "spritesheets", `${assetName}.png`), path.join(outputPath, `${assetName}.png`));

        const assets = createAssetsData(swfCollection);
        const logic = createLogicData(swfCollection);
        const visualization = await createVisualizationData(swfCollection);
        const index = createIndexData(swfCollection);

        const customParts = CustomPartsDataExtraction.getAssetParts(swfCollection);
        const palettes = PaletteDataExtraction.getAssetPalettes(swfCollection);

        PaletteDataExtraction.extractFilePalettes(assetName, outputPath, swfCollection, palettes);

        const data: FurnitureData = {
            index,
            visualization,
            logic,
            palettes,
            customParts,
            assets,
            sprites: spritesheet,
        };

        writeFileSync(path.join(outputPath, `${assetName}.json`), JSON.stringify(data, undefined, 2), {
            encoding: "utf-8"
        });
    }
}

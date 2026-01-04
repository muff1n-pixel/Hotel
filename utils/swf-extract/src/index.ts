import { copyFileSync, existsSync, mkdirSync, rmdirSync, rmSync, writeFileSync } from "fs";
import { createSpritesheet } from "./spritesheet/SpritesheetCreation.ts";
import { extractSwf } from "./swf/SwfExtraction.ts";
import path from "path";
import { createAssetsData, createIndexData, createLogicData, createVisualizationData } from "./data/DataCreation.ts";
import type { FurnitureData } from "../../../src/client/Interfaces/Furniture/FurnitureData.ts"

const assetName = process.argv[2];
const extractOnly = process.argv[3] === "extract-only";

if(!assetName) {
    throw new Error("Argument is missing for asset name.");
}

if(existsSync(path.join("temp", assetName))) {
    rmSync(path.join("temp", assetName), {
        force: true,
        recursive: true
    });
}

(async () => {
    const swfCollection = await extractSwf(assetName, `assets/${assetName}/${assetName}.swf`);

    if(extractOnly) {
        return;
    }

    const assets = createAssetsData(swfCollection);
    const logic = createLogicData(swfCollection);
    const visualization = createVisualizationData(swfCollection);
    const index = createIndexData(swfCollection);

    //console.log(JSON.stringify(index, undefined, 4));

    const spritesheet = await createSpritesheet(assetName, swfCollection.images);

    //console.log(spritesheet32Collection);

    const data: FurnitureData = {
        index,
        visualization,
        logic,
        assets,
        sprites: spritesheet
    };

    const outputPath = path.join("..", "..", "assets", "furniture", assetName);

    if(existsSync(outputPath)) {
        rmSync(outputPath, {
            force: true,
            recursive: true
        });
    }

    mkdirSync(outputPath, {
        recursive: true
    });

    writeFileSync(path.join(outputPath, `${assetName}.json`), JSON.stringify(data, undefined, 2), {
        encoding: "utf-8"
    });
    
    copyFileSync(path.join("temp", assetName, "spritesheets", `${assetName}.png`), path.join(outputPath, `${assetName}.png`));
})();


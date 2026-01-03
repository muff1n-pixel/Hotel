import { copyFileSync, existsSync, mkdirSync, rmdirSync, rmSync, writeFileSync } from "fs";
import { createSpritesheet } from "./spritesheet/SpritesheetCreation.ts";
import { extractSwf } from "./swf/SwfExtraction.ts";
import path from "path";
import { createAssetsData, createIndexData, createLogicData, createVisualizationData } from "./data/DataCreation.ts";
import type { FurnitureData } from "../../../src/client/Interfaces/Furniture/FurnitureData.ts"

if(existsSync(path.join("temp", "divider_arm2"))) {
    rmSync(path.join("temp", "divider_arm2"), {
        force: true,
        recursive: true
    });
}

(async () => {
    const swfCollection = await extractSwf("divider_arm2", "assets/divider_arm2_1767371605/divider_arm2.swf");

    const assets = createAssetsData(swfCollection);
    const logic = createLogicData(swfCollection);
    const visualization = createVisualizationData(swfCollection);
    const index = createIndexData(swfCollection);

    //console.log(JSON.stringify(index, undefined, 4));

    const spritesheet = await createSpritesheet("divider_arm2", swfCollection.images);

    //console.log(spritesheet32Collection);

    const data: FurnitureData = {
        index,
        visualization,
        logic,
        assets,
        sprites: spritesheet
    };

    const outputPath = path.join("output", "divider_arm2");

    if(existsSync(outputPath)) {
        rmSync(outputPath, {
            force: true,
            recursive: true
        });
    }

    mkdirSync(outputPath, {
        recursive: true
    });

    writeFileSync(path.join(outputPath, "divider_arm2.json"), JSON.stringify(data, undefined, 2), {
        encoding: "utf-8"
    });
    
    copyFileSync(path.join("temp", "divider_arm2", "spritesheets", "divider_arm2.png"), path.join(outputPath, "divider_arm2.png"));
})();


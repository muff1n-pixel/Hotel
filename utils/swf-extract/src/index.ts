import { copyFileSync, existsSync, mkdirSync, rmdirSync, rmSync, writeFileSync } from "fs";
import { createSpritesheet } from "./spritesheet/SpritesheetCreation.ts";
import { extractSwf } from "./swf/SwfExtraction.ts";
import path from "path";
import { createAssetsData, createAssetsDataFromManifest, createIndexData, createLogicData, createRoomVisualizationData, createVisualizationData } from "./data/DataCreation.ts";
import type { FurnitureData } from "../../../src/client/Interfaces/Furniture/FurnitureData.ts"
import type { FigureData } from "../../../src/client/Interfaces/Figure/FigureData.ts"
import type { RoomData } from "../../../src/client/Interfaces/Room/RoomData.ts"

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
    const swfCollection = await extractSwf(assetName, (existsSync(`assets/${assetName}/${assetName}.swf`))?(`assets/${assetName}/${assetName}.swf`):(`assets/${assetName}.swf`));

    if(extractOnly) {
        return;
    }

    const spritesheet = await createSpritesheet(assetName, swfCollection.images);

    if(assetName === "HabboRoomContent") {
        const outputPath = path.join("..", "..", "assets", "room", assetName);

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
        const index = createIndexData(swfCollection);
        const visualization = createRoomVisualizationData(swfCollection);

        const data: RoomData = {
            index,
            visualization,
            assets,
            sprites: spritesheet
        };

        writeFileSync(path.join(outputPath, `${assetName}.json`), JSON.stringify(data, undefined, 2), {
            encoding: "utf-8"
        });
    }
    else {
        if(!swfCollection.data.index && !swfCollection.data.visualization && swfCollection.data.manifest) {
            const outputPath = path.join("..", "..", "assets", "figure", assetName);

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

            console.log("No visualization data, assuming it's a figure asset...");

            const assets = createAssetsDataFromManifest(swfCollection);

            const data: FigureData = {
                assets,
                sprites: spritesheet
            };

            writeFileSync(path.join(outputPath, `${assetName}.json`), JSON.stringify(data, undefined, 2), {
                encoding: "utf-8"
            });
            
            return;
        }

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
        
        copyFileSync(path.join("temp", assetName, "spritesheets", `${assetName}.png`), path.join(outputPath, `${assetName}.png`));

        const assets = createAssetsData(swfCollection);
        const logic = createLogicData(swfCollection);
        const visualization = createVisualizationData(swfCollection);
        const index = createIndexData(swfCollection);

        const data: FurnitureData = {
            index,
            visualization,
            logic,
            assets,
            sprites: spritesheet
        };

        writeFileSync(path.join(outputPath, `${assetName}.json`), JSON.stringify(data, undefined, 2), {
            encoding: "utf-8"
        });
    }
})();

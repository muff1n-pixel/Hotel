import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmdirSync, rmSync, writeFileSync } from "fs";
import { createSpritesheet } from "./spritesheet/SpritesheetCreation.ts";
import { extractSwf } from "./swf/SwfExtraction.ts";
import path from "path";
import { createAssetsData, createAssetsDataFromManifest, createFurnitureData, createIndexData, createLogicData, createRoomVisualizationData, createVisualizationData } from "./data/DataCreation.ts";
import type { FurnitureData } from "../../../packages/game/src/Client/Interfaces/Furniture/FurnitureData.ts"
import type { FigureData } from "../../../packages/game/src/Client/Interfaces/Figure/FigureData.ts"
import type { RoomData } from "../../../packages/game/src/Client/Interfaces/Room/RoomData.ts"
import sqlite3 from "sqlite3";
import extractRoomChatStyles from "./extractions/RoomChatStylesExtractor.ts";
import extractFigureEffects from "./extractions/FigureEffects.ts";
import extractAvatarAnimations from "./extractions/AvatarAnimations.ts";
import { PromisePool } from "@supercharge/promise-pool";

export const database = new sqlite3.Database(":memory:");
export const flags = process.argv.slice(2).filter((argument) => argument.startsWith('-'));

if(existsSync("./furniture.sql")) {
    await new Promise<void>((resolve) => {
        database.serialize(() => {
            database.exec(readFileSync("./furniture.sql", {encoding: "utf-8"}), () => resolve());
        })
    });
}

let assetNames = process.argv.slice(2).filter((argument) => !argument.startsWith('-'));

(async () => {
    if(process.argv[2] === "roomchatstyles") {
        await extractRoomChatStyles();
        
        return;
    }
    
    if(flags.some((flag) => flag === "--effect")) {
        await extractFigureEffects(assetNames);
        
        return;
    }
    
    if(process.argv[2] === "avataranimations") {
        await extractAvatarAnimations();
        
        return;
    }

    if(process.argv[2] === "regenerate-figures") {
        assetNames = readdirSync(path.join("..", "..", "assets", "figure", "clothing"), { withFileTypes: true })
        .filter((directory) => directory.isDirectory())
        .map((directory) => directory.name);
    }
    else if(process.argv[2] === "regenerate-furniture") {
        assetNames = readdirSync(path.join("..", "..", "assets", "furniture"), { withFileTypes: true })
        .filter((directory) => directory.isDirectory())
        .map((directory) => directory.name);
    }
    else if(process.argv[2] === "generate-all") {
        const existingAssetNames = assetNames = readdirSync(path.join("..", "..", "assets", "furniture"), { withFileTypes: true})
            .filter((directory) => directory.isDirectory())
            .map((directory) => directory.name)
            .concat(
                ...readdirSync(path.join("..", "..", "assets", "figure"), { withFileTypes: true })
                .filter((directory) => directory.isDirectory())
                .map((directory) => directory.name)
            );

        console.log(existingAssetNames);

        assetNames = readdirSync(path.join("assets"), { withFileTypes: true })
        .filter((file) => file.isFile())
        .map((file) => path.basename(file.name, ".swf"))
        .filter((file) => !existingAssetNames.includes(file));
    }
    else if(process.argv[2] === "generate-furniture") {
        assetNames = readdirSync(path.join("assets", "furniture"), { withFileTypes: true })
        .filter((directory) => directory.isFile())
        .map((directory) => directory.name.split('.')[0]!);
    }

    console.log(assetNames);

    await PromisePool
        .withConcurrency(30)
        .for(assetNames)
        .process(async (assetName) => {
            const extractOnly = process.argv[3] === "extract-only";
            const newOnly = process.argv[3] === "new-only";

            console.log("Extracting " + assetName);

            //try {
                if(!assetName) {
                    throw new Error("Argument is missing for asset name.");
                }

                if(newOnly && existsSync(path.join("temp", assetName))) {
                    return;
                }

                if(existsSync(path.join("temp", assetName))) {
                    rmSync(path.join("temp", assetName), {
                        force: true,
                        recursive: true
                    });
                }

                const swfCollection = await extractSwf(assetName, (existsSync(`assets/furniture/${assetName}.swf`))?(`assets/furniture/${assetName}.swf`):(`assets/${assetName}.swf`));

                if(extractOnly) {
                    return;
                }

                if(!swfCollection.images.length) {
                    console.log("There's no images in the SWF collection.");

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

                    visualization.wallData.walls.push({
                        "id": "preview",
                        "visualizations": [
                            {
                                "size": 32,
                                "color": "F0C032",
                                "materialId": "wall_32_1"
                            },
                            {
                                "size": 64,
                                "color": "F0C032",
                                "materialId": "wall_64_1"
                            }
                        ]
                    });

                    visualization.floorData.floors.push({
                        "id": "preview",
                        "visualizations": [
                            {
                                "size": 32,
                                "color": "A57B51",
                                "materialId": "floor_32_1"
                            },
                            {
                                "size": 64,
                                "color": "A57B51",
                                "materialId": "floor_64_1"
                            }
                        ]
                    });

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
                        const outputPath = path.join("..", "..", "assets", "figure", "clothing", assetName);

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
                    const visualization = await createVisualizationData(swfCollection);
                    const index = createIndexData(swfCollection);

                    const furnitureData = await createFurnitureData(assetName);

                    if(furnitureData?.length) {
                        visualization.defaultDirection = furnitureData[0].defaultDirection;
                    }

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

                    // TODO: output SQL statements?
                    if(furnitureData) {
                        writeFileSync(path.join(outputPath, `${assetName}_serverdata.json`), JSON.stringify(furnitureData, undefined, 2), {
                            encoding: "utf-8"
                        });
                    }
                }

                console.log("Exported " + assetName);
            /*}
            catch(error) {
                console.error(error);

                reject();
            }*/
        });
})();
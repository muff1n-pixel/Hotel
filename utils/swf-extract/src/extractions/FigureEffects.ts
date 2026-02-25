import { XMLParser } from "fast-xml-parser";
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { extractSwf } from "../swf/SwfExtraction.ts";
import path from "node:path";
import type { FigureAnimationData } from "../../../../packages/game/src/Client/Interfaces/Figure/FigureAnimationData.ts";
import { createSpritesheet } from "../spritesheet/SpritesheetCreation.ts";
import type { FigureData } from "../../../../packages/game/src/Client/Interfaces/Figure/FigureData.ts";
import { createAssetsDataFromManifest, getValueAsArray } from "../data/DataCreation.ts";

export default async function extractFigureEffects(assetNames: string[]) {
    const effectMaps = getEffectMaps();

    for(let effectMap of effectMaps) {
        const assetName = effectMap["@_lib"];

        if(assetNames.length && !assetNames.includes(assetName)) {
            continue;
        }

        const collection = await extractSwf(assetName, path.join("assets", "effects", assetName + ".swf"));

        console.log(collection);

        const animationFile = collection.extra.find((path) => path.endsWith("animation.xml"));

        let animationData: FigureAnimationData | undefined;

        if(animationFile) {
            animationData = getAnimationData(animationFile);
        }
        
        const spritesheet = await createSpritesheet(assetName, collection.images);

        const assets = createAssetsDataFromManifest(collection);

        const data: FigureData = {
            assets,
            sprites: spritesheet,
            animation: animationData
        };

        const outputPath = path.join("..", "..", "assets", "figure", "effects", assetName);

        if(existsSync(outputPath)) {
            rmSync(outputPath, {
                force: true,
                recursive: true
            });
        }

        mkdirSync(outputPath, {
            recursive: true
        });
        
        if(spritesheet.length) {
            copyFileSync(path.join("temp", assetName, "spritesheets", `${assetName}.png`), path.join(outputPath, `${assetName}.png`));
        }
        
        writeFileSync(path.join(outputPath, `${assetName}.json`), JSON.stringify(data, undefined, 2), {
            encoding: "utf-8"
        });
    }

    const data = effectMaps.map((effectMap: any) => {
        return {
            id: parseInt(effectMap["@_id"]),
            library: effectMap["@_lib"]
        };
    });

    writeFileSync(path.join("..", "..", "assets", "figure", "effectmap.json"), JSON.stringify(data, undefined, 2), {
        encoding: "utf-8"
    });
}

function getEffectMaps() {
    const parser = new XMLParser({
        ignoreAttributes: false
    });

    const document = parser.parse(readFileSync("effectmap.xml", { encoding: "utf-8" }), true);

    return document.map.effect.filter((effect: any) => existsSync(path.join("assets", "effects", effect["@_lib"] + ".swf")));
}

function getAnimationData(filePath: string) {
    const parser = new XMLParser({
        ignoreAttributes: false
    });

    const document = parser.parse(readFileSync(filePath, { encoding: "utf-8" }), true);

    return {
        sprites: getValueAsArray(document.animation.sprite).map((sprite: any) => {
            return {
                id: sprite["@_id"],
                member: sprite["@_member"],
                ink: (sprite["@_ink"])?(parseInt(sprite["@_ink"])):(undefined),
                directions: sprite["direction"]?.map((direction: any) => {
                    return {
                        id: parseInt(direction["@_id"]),
                        destinationX: (direction["@_dx"])?(parseInt(direction["@_dx"])):(undefined),
                        destinationY: (direction["@_dy"])?(parseInt(direction["@_dy"])):(undefined),
                        destinationZ: parseInt(direction["@_dz"])
                    }
                }),
                useDirections: (sprite["@_directions"])?(true):(false)
            }
        }),

        add: getValueAsArray(document.animation.add).map((sprite: any) => {
            return {
                id: sprite["@_id"],
                base: sprite["@_base"],
                align: sprite["@_align"]
            };
        }),

        direction: (document.animation.direction)?(
            {
                offset: parseInt(document.animation.direction["@_offset"])
            }
        ):(undefined),

        shadow: (document.animation.shadow)?(
            {
                id: document.animation.shadow["@_id"]
            }
        ):(undefined),

        frames: getValueAsArray(document.animation.frame).map((frame: any) => {
            return {
                bodyParts: getValueAsArray(frame.bodypart).map((bodypart: any) => {
                    return {
                        id: bodypart["@_id"],
                        action: bodypart["@_action"],
                        frame: parseInt(bodypart["@_frame"]),
                        destinationY: (bodypart["@_dy"])?(parseInt(bodypart["@_dy"])):(undefined),
                        destinationX: (bodypart["@_dx"])?(parseInt(bodypart["@_dx"])):(undefined),
                        directionOffset: (bodypart["@_dd"])?(parseInt(bodypart["@_dd"])):(undefined),
                    };
                }),

                effects: getValueAsArray(frame.fx).map((fx: any) => {
                    return {
                        id: fx["@_id"],
                        action: fx["@_action"],
                        frame: parseInt(fx["@_frame"]),
                        destinationY: (fx["@_dy"])?(parseInt(fx["@_dy"])):(undefined),
                        destinationX: (fx["@_dx"])?(parseInt(fx["@_dx"])):(undefined),
                    };
                })
            };
        })
    } satisfies FigureAnimationData;
}

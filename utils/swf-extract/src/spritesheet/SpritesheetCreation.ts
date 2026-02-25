import path from "path";
import NodeSpriteGenerator from "node-sprite-generator";
import { mkdirSync, statfsSync, writeFileSync } from "fs";
import type { FurnitureSprites } from "../../../../packages/game/src/Client/Interfaces/Furniture/FurnitureSprites.ts"
import { downscaleIfNeeded } from "./Downscaling.ts";
import { flags } from "../index.ts";

export function createSpritesheet(assetName: string, images: string[]): Promise<FurnitureSprites> {
    return new Promise(async (resolve, reject) => {
        if(!images.length) {
            return resolve([]);
        };

        const outputPath = path.join("temp", assetName, "spritesheets");
        const outputFile = path.join(outputPath, `${assetName}.png`);

        mkdirSync(outputPath, {
            recursive: true
        });

        if(flags.some((flag) => flag === "--downscale")) {
            images.push(...(await Promise.all(
                images.map(async (imgPath) => {
                    return await downscaleIfNeeded(imgPath);
                })
            )));
        }

        // sprite generator is having issues creating the file
        writeFileSync(outputFile, "");

        const collection: FurnitureSprites = [];

        NodeSpriteGenerator({
            compositor: "jimp",
            src: images,
            layout: "packed",
            spritePath: outputFile,
            stylesheet: (data) => {
                for (const image of data.images) {
                    const filePath = (image as any).path as string;
                    const fileName = path.basename(filePath, ".png");

                    collection.push({
                        name: fileName,
                        x: image.x,
                        y: image.y,
                        height: image.height,
                        width: image.width
                    });
                }

                const interval = setInterval(() => {
                    if (statfsSync(outputFile).bsize > 0) {
                        clearInterval(interval);

                        setTimeout(() => {
                            resolve(collection);
                        }, 1000);
                    }
                }, 100);
            },
        }, function (error) {
            if (error) {
                reject(error.message);
            }

            //resolve(collection);
        });
    });
}

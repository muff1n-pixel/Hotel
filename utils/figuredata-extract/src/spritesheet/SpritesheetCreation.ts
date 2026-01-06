import path from "path";
import NodeSpriteGenerator from "node-sprite-generator";
import { mkdirSync, statfsSync, writeFileSync } from "fs";
import type { FurnitureSprites } from "../../../../src/client/Interfaces/Furniture/FurnitureSprites.js"

export function createSpritesheet(assetName: string, images: string[]): Promise<FurnitureSprites> {
    return new Promise((resolve) => {
        const outputPath = path.join("temp", assetName, "spritesheets");
        const outputFile = path.join(outputPath, `${assetName}.png`);

        mkdirSync(outputPath, {
            recursive: true
        });

        // sprite generator is having issues creating the file
        writeFileSync(outputFile, "");

        const collection: FurnitureSprites = [];

        NodeSpriteGenerator({
            compositor: "jimp",
            src: images,
            layout: "packed",
            spritePath: outputFile,
            stylesheet: (data) => {
                for(const image of data.images) {
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
                    if(statfsSync(outputFile).bsize > 0) {
                        clearInterval(interval);

                        resolve(collection);
                    }
                }, 100);
            }
        }, function (error) {
            if(error) {
                throw new Error(error.message);
            }

            resolve(collection);
        });
    });
}

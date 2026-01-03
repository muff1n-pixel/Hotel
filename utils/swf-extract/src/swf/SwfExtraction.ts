import fs from "fs";
import path from "path";
import { Jimp, rgbaToInt } from "jimp";
import zlib from "zlib";

//@ts-expect-error
import SWFReader from "@gizeta/swf-reader";

export type SwfExtractionCollection = {
    data: {
        index?: string;
        assets?: string;
        logic?: string;
        visualization?: string;
    };

    images: string[];
}

export async function extractSwf(assetName: string, filePath: string) {
    const output = path.join("temp", assetName);

    fs.mkdirSync(path.join("temp", assetName, "images"), {
        recursive: true
    });

    const swf = SWFReader.readSync(filePath);

    const map = swf.tags.find((tag: any) => tag.header.code === 76).symbols.map((symbol: any) => {
        symbol.name = symbol.name.substr(assetName.length + 1);

        return symbol;
    });

    const collection: SwfExtractionCollection = {
        data: {},
        images: []
    };

    for (const tag of swf.tags) {
        // binary
        if (tag.header.code === 87) {
            const symbol = map.find((symbol: any) => symbol.id === tag.data.readUInt16LE());

            if (!symbol) {
                continue;
            }

            const fileOutput = path.join(output, `${symbol.name}.xml`);

            const baseName = path.basename(fileOutput, ".xml");

            const dataType = baseName.substring(baseName.lastIndexOf('_') + 1);

            switch(dataType) {
                case "index":
                case "logic":
                case "visualization":
                case "assets":
                    collection.data[dataType] = fileOutput;

                    fs.writeFileSync(fileOutput, tag.data.slice(6));
                    break;
            }
        }

        // image
        if (tag.header.code === 36) {
            const symbol = map.find((symbol: any) => symbol.id === tag.characterId);

            if (!symbol) {
                continue;
            }

            const image = new Jimp({
                width: tag.bitmapWidth, 
                height: tag.bitmapHeight
            });

            const bitmap = zlib.unzipSync(Buffer.from(tag.zlibBitmapData, "hex"));

            let pos = 0;

            for (let y = 0; y < tag.bitmapHeight; y++) {
                for (let x = 0; x < tag.bitmapWidth; x++) {
                    const a = bitmap.readUInt8(pos++);
                    const r = bitmap.readUInt8(pos++);
                    const g = bitmap.readUInt8(pos++);
                    const b = bitmap.readUInt8(pos++);

                    image.setPixelColor(rgbaToInt(r, g, b, a), x, y);
                }
            }

            const spriteName = symbol.name.substring(assetName.length + 1);

            const imageOutput = path.join(output, "images", `${symbol.name}.png`);

            collection.images.push(imageOutput);
            await image.write(imageOutput as any);
        }
    }

    return collection;
}

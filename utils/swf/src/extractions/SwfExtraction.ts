import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import path from "path";
import { Jimp, rgbaToInt } from "jimp";
import zlib from "zlib";

//@ts-expect-error
import SWFReader from "@gizeta/swf-reader";

export type SwfExtractionResult = {
    data: {
        index?: string;
        assets?: string;
        logic?: string;
        visualization?: string;
        manifest?: string;
    };

    extra: string[];

    images: string[];
};

export default class SwfExtraction {
    private imagesTempPath: string;
    private manifestsTempPath: string;

    private readonly assetName: string;
    private readonly assetPath: string;

    constructor(assetName: string, assetPath: string, tempPath: string) {
        this.assetName = assetName;
        this.assetPath = assetPath;

        this.imagesTempPath = path.join(tempPath, "images");
        this.manifestsTempPath = path.join(tempPath, "manifests");
    }

    public async execute() {
        this.createTempFolder();

        const swf = SWFReader.readSync(this.assetPath);

        const map = this.getSymbolMaps(swf);

        const result: SwfExtractionResult = {
            data: {},
            extra: [],
            images: []
        };

        for (const tag of swf.tags) {
            // binary
            if (tag.header.code === 87) {
                let symbol = map.find((symbol: any) => symbol.id === tag.data.readUInt16LE());

                if (!symbol || !symbol.name) {
                    continue;
                }

                const fileOutput = path.join(this.manifestsTempPath, `${symbol.name}.xml`);

                const baseName = path.basename(fileOutput, ".xml");

                const dataType = baseName.substring(baseName.lastIndexOf('_') + 1);

                switch(dataType) {
                    case "index":
                    case "logic":
                    case "visualization":
                    case "assets":
                    case "manifest":
                        result.data[dataType] = fileOutput;
                        break;

                    case "room_assets":
                        result.data["assets"] = fileOutput;
                        break;

                    default:
                        result.extra.push(fileOutput);

                        break;
                }

                writeFileSync(fileOutput, tag.data.slice(6));
            }

            // image
            if (tag.header.code === 36) {
                const symbols = map.filter((symbol: any) => symbol.id === tag.characterId && symbol.name);

                if (!symbols.length) {
                    console.log("Found tag without a symbol", {
                        tag
                    });

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
                        const alpha = bitmap.readUInt8(pos++);

                        let r = bitmap.readUInt8(pos++);
                        let g = bitmap.readUInt8(pos++);
                        let b = bitmap.readUInt8(pos++);

                        if (alpha !== 0) {
                            r = Math.min(255, Math.round((r * 255) / alpha));
                            g = Math.min(255, Math.round((g * 255) / alpha));
                            b = Math.min(255, Math.round((b * 255) / alpha));
                        }

                        image.setPixelColor(rgbaToInt(r, g, b, alpha), x, y);
                    }
                }

                for(let symbol of symbols) {
                    const imageOutput = path.join(this.imagesTempPath, `${symbol.name}.png`);
                    result.images.push(imageOutput);
                    await image.write(imageOutput as any);
                }
            }
        }

        return result;
    }

    private createTempFolder() {
        mkdirSync(this.imagesTempPath);

        mkdirSync(this.manifestsTempPath);
    }

    private getSymbolMaps(swfReader: any) {
        return swfReader.tags.find((tag: any) => tag.header.code === 76).symbols.map((symbol: any) => {
            //console.log(symbol);
            symbol.name = symbol.name.substr(this.assetName.length + 1);

            return symbol;
        });
    }
}

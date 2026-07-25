import path from "path";
import SwfExtraction from "./SwfExtraction.ts";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import SpritesheetGenerator from "../images/SpritesheetGenerator.ts";
import FurnitureDataExtraction from "./FurnitureDataExtraction.ts";
import ManifestVisualizationExtraction from "./manifests/ManifestVisualizationExtraction.ts";
import ManifestAssetsExtraction from "./manifests/ManifestAssetsExtraction.ts";
import ManifestLogicExtraction from "./manifests/ManifestLogicExtraction.ts";
import ManifestIndexExtraction from "./manifests/ManifestIndexExtraction.ts";

export default class FurnitureExtraction {
    private readonly assetName: string;
    private readonly assetPath: string;
    private readonly tempPath: string;

    constructor(assetName: string) {
        this.assetName = assetName;
        this.assetPath = path.join(process.env.FURNITURE_INPUT_PATH!, `${assetName}.swf`);
        this.tempPath = path.join("temp", assetName);
    }

    public async execute() {
        this.createTempPath();

        const swfExtraction = new SwfExtraction(this.assetName, this.assetPath, this.tempPath);

        const swfResult = await swfExtraction.execute();

        const spritesheetGenerator = new SpritesheetGenerator(swfResult.images);

        const spritesheetResult = await spritesheetGenerator.execute();

        if(!swfResult.data.visualization) {
            throw new Error("Visualization data is missing.");
        }

        if(!swfResult.data.assets) {
            throw new Error("Assets data is missing.");
        }

        if(!swfResult.data.logic) {
            throw new Error("Logic data is missing.");
        }

        if(!swfResult.data.index) {
            throw new Error("Index data is missing.");
        }

        const furnitureDataExtraction = new FurnitureDataExtraction(this.assetName);

        await furnitureDataExtraction.prepare();

        const manifestVisualizationExtraction = new ManifestVisualizationExtraction(swfResult.data.visualization);
        const manifestAssetsExtraction = new ManifestAssetsExtraction(swfResult.data.assets);
        const manifestLogicExtraction = new ManifestLogicExtraction(swfResult.data.logic);
        const manifestIndexExtraction = new ManifestIndexExtraction(swfResult.data.index);

        const furnitureData = await furnitureDataExtraction.execute();

        const visualization = await manifestVisualizationExtraction.execute(furnitureData);
        const assets = await manifestAssetsExtraction.execute();
        const logic = await manifestLogicExtraction.execute();
        const index = await manifestIndexExtraction.execute();

        const outputPath = path.join(process.env.ASSETS_OUTPUT_PATH!, "furniture", this.assetName);

        if(existsSync(outputPath)) {
            rmSync(outputPath, {
                force: true,
                recursive: true
            });
        }

        mkdirSync(outputPath, {
            recursive: true
        });

        writeFileSync(path.join(outputPath, `${this.assetName}.png`), spritesheetResult.imageBuffer);
        writeFileSync(path.join(outputPath, `${this.assetName}.json`), JSON.stringify({
            index,
            logic,
            visualization,
            assets,
            sprites: spritesheetResult.sprites,
        }, undefined, 2));

        if(furnitureData) {
            writeFileSync(path.join(outputPath, `${this.assetName}_serverdata.json`), JSON.stringify(furnitureData, undefined, 2), {
                encoding: "utf-8"
            });
        }
    }

    private createTempPath() {
        if(existsSync(this.tempPath)) {
            rmSync(this.tempPath, {
                force: true,
                recursive: true
            });
        }

        mkdirSync(this.tempPath, {
            recursive: true
        });
    }
}

import path from "path";
import SwfExtraction from "./SwfExtraction.ts";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import SpritesheetGenerator from "../images/SpritesheetGenerator.ts";
import ManifestAssetsExtraction from "./manifests/ManifestAssetsExtraction.ts";
import ManifestIndexExtraction from "./manifests/ManifestIndexExtraction.ts";
import ManifestRoomVisualizationExtraction from "./manifests/ManifestRoomVisualizationExtraction.ts";

export default class HabboRoomContentExtraction {
    private readonly assetName: string;
    private readonly assetPath: string;
    private readonly tempPath: string;

    constructor(assetName: string) {
        this.assetName = assetName;
        this.assetPath = path.join(process.env.ASSETS_INPUT_PATH!, `${assetName}.swf`);
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

        if(!swfResult.data.index) {
            throw new Error("Index data is missing.");
        }

        const manifestAssetsExtraction = new ManifestAssetsExtraction(swfResult.data.assets);
        const manifestIndexExtraction = new ManifestIndexExtraction(swfResult.data.index);
        const manifestRoomVisualizationExtraction = new ManifestRoomVisualizationExtraction(swfResult.data.visualization);

        const assets = await manifestAssetsExtraction.execute();
        const index = await manifestIndexExtraction.execute();
        const visualization = await manifestRoomVisualizationExtraction.execute();
        
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

        const outputPath = path.join(process.env.ASSETS_OUTPUT_PATH!, "room", this.assetName);

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
            visualization,
            assets,
            sprites: spritesheetResult.sprites,
        }, undefined, 2));
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

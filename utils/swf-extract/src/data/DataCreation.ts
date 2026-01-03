import type { SwfExtractionCollection } from "../swf/SwfExtraction.ts";
import type { FurnitureAsset, FurnitureAssets } from "../../../../src/client/Interfaces/Furniture/FurnitureAssets.ts"
import type { FurnitureLogic } from "../../../../src/client/Interfaces/Furniture/FurnitureLogic.ts"
import type { FurnitureVisualization } from "../../../../src/client/Interfaces/Furniture/FurnitureVisualization.ts"
import type { FurnitureIndex } from "../../../../src/client/Interfaces/Furniture/FurnitureIndex.ts"
import { XMLParser } from "fast-xml-parser";
import { readFileSync } from "fs";

function getValueAsArray(value: any) {
    if(!value) {
        return [];
    }

    if(value.length) {
        return value;
    }

    return [value];
}

export function createAssetsData(collection: SwfExtractionCollection): FurnitureAssets {
    if(!collection.data.assets) {
        throw new Error("Assets data doesn't exist.");
    }

    const parser = new XMLParser({
        ignoreAttributes: false
    });

    const document = parser.parse(readFileSync(collection.data.assets, { encoding: "utf-8" }), true);

    return document.assets.asset.map((asset: any) => {
        return {
            name: asset["@_name"],

            x: parseFloat(asset["@_x"]),
            y: parseFloat(asset["@_y"]),

            flipHorizontal: asset["@_flipH"] === '1',
            flipVertical: asset["@_flipV"] === '1',
        } satisfies FurnitureAsset;
    });
}

export function createLogicData(collection: SwfExtractionCollection): FurnitureLogic {
    if(!collection.data.logic) {
        throw new Error("Logic data doesn't exist.");
    }

    const parser = new XMLParser({
        ignoreAttributes: false
    });

    const document = parser.parse(readFileSync(collection.data.logic, { encoding: "utf-8" }), true);

    return {
        type: document["objectData"]["@_type"],
        model: {
            dimensions: {
                x: parseFloat(document["objectData"]["model"]["dimensions"]["@_x"]),
                y: parseFloat(document["objectData"]["model"]["dimensions"]["@_y"]),
                z: parseFloat(document["objectData"]["model"]["dimensions"]["@_z"])
            },
            directions: getValueAsArray(document["objectData"]["model"]["directions"]["direction"]).map((direction: any) => {
                return {
                    id: parseInt(direction["@_id"])
                } satisfies FurnitureLogic["model"]["directions"][0]
            })
        }
    } satisfies FurnitureLogic;
}

export function createVisualizationData(collection: SwfExtractionCollection): FurnitureVisualization {
    if(!collection.data.visualization) {
        throw new Error("Visualization data doesn't exist.");
    }

    const parser = new XMLParser({
        ignoreAttributes: false
    });

    const document = parser.parse(readFileSync(collection.data.visualization, { encoding: "utf-8" }), true);

    return {
        type: document["visualizationData"]["@_type"],
        visualizations: document["visualizationData"]["graphics"]["visualization"].map((visualization: any) => {
            return {
                size: parseInt(visualization["@_size"]) as 1 | 32 | 64,
                layerCount: parseInt(visualization["@_layerCount"]),
                angle: parseInt(visualization["@_angle"]),

                layers: getValueAsArray(visualization["layers"]?.["layer"]).map((layer: any) => {
                    return {
                        id: parseInt(layer["@_id"]),
                        zIndex: parseInt(layer["@_id"])
                    } satisfies FurnitureVisualization["visualizations"][0]["layers"][0]
                }),

                directions: getValueAsArray(visualization["directions"]["direction"]).map((direction: any) => {
                    return {
                        id: parseInt(direction["@_id"])
                    } satisfies FurnitureVisualization["visualizations"][0]["directions"][0]
                })
            } satisfies FurnitureVisualization["visualizations"][0]
        })
    } satisfies FurnitureVisualization;
}

export function createIndexData(collection: SwfExtractionCollection): FurnitureIndex {
    if(!collection.data.index) {
        throw new Error("Index data doesn't exist.");
    }

    const parser = new XMLParser({
        ignoreAttributes: false
    });

    const document = parser.parse(readFileSync(collection.data.index, { encoding: "utf-8" }), true);

    return {
        type: document["object"]["@_type"],
        visualization: document["object"]["@_visualization"],
        logic: document["object"]["@_logic"],
    } satisfies FurnitureIndex;
}

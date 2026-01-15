import type { SwfExtractionCollection } from "../swf/SwfExtraction.js";
import type { FurnitureAsset, FurnitureAssets } from "../../../../packages/client/src/Client/Interfaces/Furniture/FurnitureAssets.ts"
import type { FigureAssets } from "../../../../packages/client/src/Client/Interfaces/Figure/FigureAssets.ts"
import type { FurnitureLogic } from "../../../../packages/client/src/Client/Interfaces/Furniture/FurnitureLogic.ts"
import type { FurnitureVisualization } from "../../../../packages/client/src/Client/Interfaces/Furniture/FurnitureVisualization.ts"
import type { RoomVisualization } from "../../../../packages/client/src/Client/Interfaces/Room/RoomVisualization.ts"
import type { FurnitureIndex } from "../../../../packages/client/src/Client/Interfaces/Furniture/FurnitureIndex.ts"
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

            x: parseFloat(asset["@_x"]) * -1,
            y: parseFloat(asset["@_y"]) * -1,

            flipHorizontal: asset["@_flipH"] === '1',

            source: asset["@_source"]
        } satisfies FurnitureAsset;
    });
}

export function createAssetsDataFromManifest(collection: SwfExtractionCollection): FigureAssets {
    if(!collection.data.manifest) {
        throw new Error("Manifest data for assets doesn't exist.");
    }

    const parser = new XMLParser({
        ignoreAttributes: false
    });

    const document = parser.parse(readFileSync(collection.data.manifest, { encoding: "utf-8" }), true);

    return document.manifest.library.assets.asset.filter((asset: any) => asset["@_mimeType"] === 'image/png').map((asset: any) => {
        const offset = getValueAsArray(asset["param"]).find((asset: any) => asset["@_key"] === 'offset')?.["@_value"]?.split(',');

        return {
            name: asset["@_name"],

            x: parseFloat(offset?.[0] ?? 0) * -1,
            y: parseFloat(offset?.[1] ?? 0) * -1,
        };
    }).concat(
        getValueAsArray(document.manifest.library.aliases?.alias).map((alias: any) => {
            const originalAsset = document.manifest.library.assets.asset.find((asset: any) => asset["@_name"] === alias["@_link"]);
            
            const offset = getValueAsArray(originalAsset?.["param"]).find((asset: any) => asset["@_key"] === 'offset')?.["@_value"]?.split(',');
            
            return {
                name: alias["@_name"],

                x: parseFloat(offset?.[0] ?? 0) * -1,
                y: parseFloat(offset?.[1] ?? 0) * -1,

                source: alias["@_link"],

                flipHorizonal: alias["@_fliph"] === '1'
            };
        })
    );
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
            directions: getValueAsArray(document["objectData"]["model"]["directions"]?.["direction"]).map((direction: any) => {
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
                        zIndex: parseInt(layer["@_z"]),
                        ink: layer["@_ink"],
                        ignoreMouse: layer["@_ignoreMouse"] === '1',
                        alpha: layer["@_alpha"] ? parseInt(layer["@_alpha"]) : undefined,
                    }
                }),

                directions: getValueAsArray(visualization["directions"]?.["direction"]).map((direction: any) => {
                    return {
                        id: parseInt(direction["@_id"])
                    } satisfies FurnitureVisualization["visualizations"][0]["directions"][0]
                }),

                colors: getValueAsArray(visualization["colors"]?.["color"]).map((color: any) => {
                    return {
                        id: parseInt(color["@_id"]),
                        layers: getValueAsArray(color["colorLayer"]).map((layer: any) => {
                            return {
                                id: parseInt(layer["@_id"]),
                                color: layer["@_color"]
                            }
                        })
                    }
                }),

                animations: getValueAsArray(visualization["animations"]?.["animation"]).map((animation: any) => {
                    return {
                        id: parseInt(animation["@_id"]),

                        layers: getValueAsArray(animation["animationLayer"]).map((layer: any) => {
                            return {
                                id: parseInt(layer["@_id"]),
                                loopCount: layer["@_loopCount"] ? parseInt(layer["@_loopCount"]) : undefined,
                                frameRepeat: layer["@_frameRepeat"] ? parseInt(layer["@_frameRepeat"]) : undefined,

                                frameSequence: getValueAsArray(layer["frameSequence"]?.["frame"]).map((frame: any) => {
                                    return {
                                        id: parseInt(frame["@_id"])
                                    }
                                })
                            }
                        })
                    }
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

export function createRoomVisualizationData(collection: SwfExtractionCollection): RoomVisualization {
    if(!collection.data.visualization) {
        console.log(collection.data);
        throw new Error("Room visualization data doesn't exist.");
    }

    const parser = new XMLParser({
        ignoreAttributes: false
    });

    const document = parser.parse(readFileSync(collection.data.visualization, { encoding: "utf-8" }), true);

    return {
        wallData: {
            walls: getValueAsArray(document["visualizationData"]["wallData"]["walls"]["wall"]).map((wall: any) => {
                return {
                    id: wall["@_id"],

                    visualizations: getValueAsArray(wall["visualization"]).map((visualization: any) => {
                        return {
                            size: parseInt(visualization["@_size"]),
                            color: visualization["visualizationLayer"]["@_color"].substring(2),
                            materialId: visualization["visualizationLayer"]["@_materialId"],
                        };
                    })
                };
            }),

            materials: getValueAsArray(document["visualizationData"]["wallData"]["materials"]["material"]).map((material: any) => {
                return {
                    id: material["@_id"],
                    width: parseInt(material["materialCellMatrix"]["materialCellColumn"]["@_width"]),
                    textureId: material["materialCellMatrix"]["materialCellColumn"]["materialCell"]["@_textureId"]
                };
            }),

            textures: getValueAsArray(document["visualizationData"]["wallData"]["textures"]["texture"]).map((texture: any) => {
                return {
                    id: texture["@_id"],
                    assetName: texture["bitmap"]["@_assetName"]
                };
            })
        },
        floorData: {
            floors: getValueAsArray(document["visualizationData"]["floorData"]["floors"]["floor"]).map((floor: any) => {
                return {
                    id: floor["@_id"],

                    visualizations: getValueAsArray(floor["visualization"]).map((visualization: any) => {
                        return {
                            size: parseInt(visualization["@_size"]),
                            color: visualization["visualizationLayer"]["@_color"].substring(2),
                            materialId: visualization["visualizationLayer"]["@_materialId"],
                        };
                    })
                };
            }),

            materials: getValueAsArray(document["visualizationData"]["floorData"]["materials"]["material"]).map((material: any) => {
                return {
                    id: material["@_id"],
                    width: parseInt(material["materialCellMatrix"]["materialCellColumn"]["@_width"]),
                    textureId: material["materialCellMatrix"]["materialCellColumn"]["materialCell"]["@_textureId"]
                };
            }),

            textures: getValueAsArray(document["visualizationData"]["floorData"]["textures"]["texture"]).map((texture: any) => {
                return {
                    id: texture["@_id"],
                    assetName: texture["bitmap"]["@_assetName"]
                };
            })
        }
    } satisfies RoomVisualization;
}


export function createFurnitureData(assetName: string) {
    const parser = new XMLParser({
        ignoreAttributes: false
    });

    const document = parser.parse(readFileSync("furnidata.xml", { encoding: "utf-8" }), false);

    let furniTypes = document["furnidata"]["roomitemtypes"]["furnitype"].filter((furniType: any) => furniType["@_classname"].split('*')[0] === assetName);
    let isWallFurniture = false;
    
    if(!furniTypes.length) {
        furniTypes = document["furnidata"]["wallitemtypes"]["furnitype"].filter((furniType: any) => furniType["@_classname"].split('*')[0] === assetName);
        isWallFurniture = true;
    }

    if(!furniTypes.length) {
        console.error("Failed to find furni type in furnidata for " + assetName);

        return null;
    }

    return furniTypes.map((furniType: any) => {
        const color = furniType["@_classname"].split('*')[1];

        return {
            name: furniType["name"],
            description: furniType["description"],

            color: (color)?(parseInt(color)):(undefined),

            placement: (isWallFurniture)?("wall"):("floor"),
            defaultDirection: (furniType["defaultdir"])?(parseInt(furniType["defaultdir"])):(undefined)
        };
    });
}

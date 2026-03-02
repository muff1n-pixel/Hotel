import type { SwfExtractionCollection } from "../swf/SwfExtraction.js";
import type { FurnitureAsset, FurnitureAssets } from "../../../../packages/game/src/Client/Interfaces/Furniture/FurnitureAssets.ts"
import type { FigureAssets } from "../../../../packages/game/src/Client/Interfaces/Figure/FigureAssets.ts"
import type { FurnitureLogic } from "../../../../packages/game/src/Client/Interfaces/Furniture/FurnitureLogic.ts"
import type { FurnitureVisualization } from "../../../../packages/game/src/Client/Interfaces/Furniture/FurnitureVisualization.ts"
import type { RoomVisualization } from "../../../../packages/game/src/Client/Interfaces/Room/RoomVisualization.ts"
import type { FurnitureIndex } from "../../../../packages/game/src/Client/Interfaces/Furniture/FurnitureIndex.ts"
import { XMLParser } from "fast-xml-parser";
import { readFileSync } from "fs";
import { database, flags } from "../index.ts";

export function getValueAsArray(value: any) {
    if (!value) {
        return [];
    }

    if (value.length) {
        return value;
    }

    return [value];
}

export function createAssetsData(collection: SwfExtractionCollection): FurnitureAssets {
    if (!collection.data.assets) throw new Error("Assets data doesn't exist.");

    const parser = new XMLParser({ ignoreAttributes: false });
    const document = parser.parse(readFileSync(collection.data.assets, { encoding: "utf-8" }), true);

    let assets: any[] = document.assets.asset;

    const assetNames = assets.map((asset: any) => asset["@_name"]);
    const has32Assets = assetNames.some((name: string) =>
        name.includes("_32_") || name.endsWith("_32")
    );

    if (!has32Assets && flags.some((flag) => flag === "--downscale")) {
        console.log("Adding downscaled 32 sprites.");

        const duplicated: any[] = [];

        for (const asset of assets) {
            const clone = { ...asset };

            let newName = asset["@_name"].replace(/_64_/g, "_32_");

            if (newName === asset["@_name"]) {
                newName = asset["@_name"] + "_32";
            }

            clone["@_name"] = newName;

            if (clone["@_x"] !== undefined) {
                clone["@_x"] = Math.round(parseFloat(clone["@_x"]) / 2).toString();
            }

            if (clone["@_y"] !== undefined) {
                clone["@_y"] = Math.round(parseFloat(clone["@_y"]) / 2).toString();
            }

            if (clone["@_source"]) {
                clone["@_source"] = clone["@_source"].replace(/_64_/g, "_32_");
            }

            duplicated.push(clone);
        }

        assets = [...assets, ...duplicated];
    }

    return assets.map((asset: any) => ({
        name: asset["@_name"],
        x: parseFloat(asset["@_x"]) * -1,
        y: parseFloat(asset["@_y"]) * -1,
        flipHorizontal: asset["@_flipH"] === '1',
        source: asset["@_source"]
    }));
}

export function createAssetsDataFromManifest(collection: SwfExtractionCollection): FigureAssets {
    if (!collection.data.manifest) {
        throw new Error("Manifest data for assets doesn't exist.");
    }

    const parser = new XMLParser({
        ignoreAttributes: false
    });

    const document = parser.parse(readFileSync(collection.data.manifest, { encoding: "utf-8" }), true);

    return getValueAsArray(document.manifest.library.assets?.asset).filter((asset: any) => asset["@_mimeType"] === 'image/png').map((asset: any) => {
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
    if (!collection.data.logic) {
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

export async function createVisualizationData(collection: SwfExtractionCollection): Promise<FurnitureVisualization> {
    if (!collection.data.visualization) {
        throw new Error("Visualization data doesn't exist.");
    }

    const parser = new XMLParser({
        ignoreAttributes: false
    });

    const document = parser.parse(readFileSync(collection.data.visualization, { encoding: "utf-8" }), true);

    const furnitureData = await createFurnitureData(document["visualizationData"]["@_type"]);

    let visualizationBlocks = getValueAsArray(document["visualizationData"]["graphics"]["visualization"]);

    const isVisualizationUseful = (visualization: any): boolean => {
        const directions = getValueAsArray(visualization["directions"]?.["direction"]);

        return directions.some((direction: any) =>
            getValueAsArray(direction["layer"]).length > 0
        );
    };

    const size32Index = visualizationBlocks.findIndex((v: any) => parseInt(v["@_size"]) === 32);
    const size64Block = visualizationBlocks.find((v: any) => parseInt(v["@_size"]) === 64);

    const hasUseful32 = size32Index !== -1 && isVisualizationUseful(visualizationBlocks[size32Index]);
    const has64 = !!size64Block;

    if (!hasUseful32 && has64 && flags.some((flag) => flag === "--downscale")) {
        const vis32 = structuredClone(size64Block);
        vis32["@_size"] = "32";

        if (size32Index !== -1) {
            visualizationBlocks[size32Index] = vis32;
        } else {
            visualizationBlocks = [vis32, ...visualizationBlocks];
        }
    }

    return {
        type: document["visualizationData"]["@_type"],
        placement: furnitureData?.[0]?.placement ?? "floor",
        visualizations: visualizationBlocks.map((visualization: any) => {
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
                        tag: layer["@_tag"],
                        alpha: layer["@_alpha"] ? parseInt(layer["@_alpha"]) : undefined,
                    }
                }),

                directions: getValueAsArray(visualization["directions"]?.["direction"]).map((direction: any) => {
                    return {
                        id: parseInt(direction["@_id"]),
                        layers: getValueAsArray(direction["layer"]).map((layer: any) => {
                            return {
                                id: parseInt(layer["@_id"]),
                                x: (layer["@_x"]) ? parseInt(layer["@_x"]) : undefined,
                                y: (layer["@_y"]) ? parseInt(layer["@_y"]) : undefined,
                                zIndex: (layer["@_z"]) ? parseInt(layer["@_z"]) : undefined,
                            };
                        })
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
    if (!collection.data.index) {
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
    if (!collection.data.visualization) {
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

export async function createFurnitureData(assetName: string) {
    const parser = new XMLParser({
        ignoreAttributes: false
    });

    const document = parser.parse(readFileSync("furnidata.xml", { encoding: "utf-8" }), false);

    let furniTypes = document["furnidata"]["roomitemtypes"]["furnitype"].filter((furniType: any) => furniType["@_classname"].split('*')[0] === assetName);
    let isWallFurniture = false;

    if (!furniTypes.length) {
        furniTypes = document["furnidata"]["wallitemtypes"]["furnitype"].filter((furniType: any) => furniType["@_classname"].split('*')[0] === assetName);
        
        if(furniTypes.length) {
            isWallFurniture = true;
        }
    }

    if (!furniTypes.length) {
        console.error("Failed to find furni type in furnidata for " + assetName);

        furniTypes = [
            {
                "@_classname": assetName
            }
        ];
    }

    return await Promise.all(furniTypes.map(async (furniType: any) => {
        const color = furniType["@_classname"].split('*')[1];

        const hasDescription = furniType["description"] && !furniType["description"].endsWith(" desc");

        const result: any = await new Promise((resolve) => {
            database.get("SELECT * FROM items_base WHERE item_name = '" + furniType["@_classname"] + "' LIMIT 1", (error, row) => {
                resolve(row);
            });
        });

        let customParams: unknown[] | null = (furniType["customparams"]) ? (furniType["customparams"].toString().split(',').map((value: string) => parseFloat(value))) : (null);

        if (result?.interaction_type === "vendingmachine" && result?.vending_ids) {
            customParams = result.vending_ids.split(',').map((id: string) => parseInt(id));
        }

        return {
            name: furniType["name"],
            description: hasDescription && furniType["description"],

            color: (color) ? (parseInt(color)) : (undefined),

            placement: (isWallFurniture) ? ("wall") : ("floor"),
            defaultDirection: (furniType["defaultdir"]) ? (parseInt(furniType["defaultdir"])) : (undefined),

            category: furniType["category"],
            interactionType: result?.interaction_type ?? "default",

            flags: {
                stackable: (result?.allow_stack ?? 1) === 1,
                sitable: (result?.allow_sit ?? 1) === 1,
                layable: (result?.allow_lay ?? 1) === 1,
                walkable: (result?.allow_walk ?? 1) === 1,
                giftable: (result?.allow_gift ?? 1) === 1,
                tradable: (result?.allow_trade ?? 1) === 1,
                recyclable: (result?.allow_recycle ?? 1) === 1,
                sellable: (result?.allow_marketplace_sell ?? 1) === 1,
                inventoryStackable: (result?.allow_inventory_stack ?? 1) === 1
            },

            customParams
        };
    }));
}

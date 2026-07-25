import { XMLParser } from "fast-xml-parser";
import { readFileSync } from "node:fs";
import { getValueAsArray } from "../../helpers.ts";
import type { RoomVisualization } from "../../../../../packages/game/src/Client/Interfaces/Room/RoomVisualization.ts"

export default class ManifestRoomVisualizationExtraction {
    private readonly filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    public async execute() {
        const parser = new XMLParser({
            ignoreAttributes: false
        });

        const document = parser.parse(readFileSync(this.filePath, { encoding: "utf-8" }), true);

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
            },
            landscapeData: {
                landscapes: getValueAsArray(document["visualizationData"]["landscapeData"]["landscapes"]["landscape"]).map((landscape: any) => {
                    return {
                        id: landscape["@_id"],

                        visualizations: getValueAsArray(landscape["animatedVisualization"]).map((visualization: any) => {
                            const color = getValueAsArray(visualization["visualizationLayer"]).find((layer: any) => layer["@_color"]);

                            return {
                                size: parseInt(visualization["@_size"]),
                                color: (color)?(new String(color["@_color"]).replace('0x', '#')):(undefined),
                                visualizationLayers: getValueAsArray(visualization["visualizationLayer"]).filter((layer: any) => !layer["@_color"]).map((layer: any) => {
                                    return {
                                        materialId: layer["@_materialId"],
                                        align: layer["@_align"],
                                        color: layer["@_color"]
                                    };
                                }),
                                animationLayers: getValueAsArray(visualization["animationLayer"]?.["animationItem"]).map((animationItem: any) => {
                                    return {
                                        id: parseInt(animationItem["@_id"]),
                                        assetId: animationItem["@_assetId"],
                                        speedX: (animationItem["@_speedX"])?(parseFloat(animationItem["@_speedX"])):(undefined),
                                        speedY: (animationItem["@_speedY"])?(parseFloat(animationItem["@_speedY"])):(undefined),
                                        randomX: (animationItem["@_randomX"])?(parseFloat(animationItem["@_randomX"])):(undefined),
                                        randomY: (animationItem["@_randomY"])?(parseFloat(animationItem["@_randomY"])):(undefined),
                                    };
                                })
                            }
                        })
                    };
                }),

                materials: getValueAsArray(document["visualizationData"]["landscapeData"]["materials"]["material"]).map((material: any) => {
                    return {
                        id: material["@_id"],
                        cellMatrixes: getValueAsArray(material["materialCellMatrix"]).map((cellMatrix: any) => {
                            return {
                                repeatMode: cellMatrix["@_repeatMode"],
                                align: cellMatrix["@_align"],
                                normalMinX: parseFloat(cellMatrix["@_normalMinX"]),

                                cellColumns: getValueAsArray(cellMatrix["materialCellColumn"]).map((cellColumn: any) => {
                                    return {
                                        width: parseInt(cellColumn["@_width"]),
                                        repeatMode: cellColumn["@_repeatMode"],

                                        cells: getValueAsArray(cellColumn["materialCell"]).map((cell: any) => {
                                            return {
                                                textureId: cell["@_textureId"],

                                                extraItemData: (cell["extraItemData"])?({
                                                    limitMax: parseInt(cell["extraItemData"]["@_limitMax"]),
                                                    types: getValueAsArray(cell["extraItemData"]["extraItemTypes"]["extraItemType"]).map((extraItemType: any) => {
                                                        return {
                                                            assetName: extraItemType["@_assetName"]
                                                        };
                                                    }),

                                                    offsets: getValueAsArray(cell["extraItemData"]["offsets"]["offset"]).map((offset: any) => {
                                                        return {
                                                            id: parseInt(offset["@_id"]),
                                                            x: parseInt(offset["@_x"]),
                                                            y: parseInt(offset["@_y"]),
                                                        }
                                                    })
                                                }):(undefined)
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    };
                }),

                textures: getValueAsArray(document["visualizationData"]["landscapeData"]["textures"]["texture"]).map((texture: any) => {
                    return {
                        id: texture["@_id"],

                        assets: getValueAsArray(texture["bitmap"]).map((bitmap: any) => {
                            return {
                                assetName: bitmap["@_assetName"],
                                normalMinX: parseFloat(bitmap["@_normalMinX"])
                            };
                        })
                    }
                })
            }
        } satisfies RoomVisualization;
    }
}

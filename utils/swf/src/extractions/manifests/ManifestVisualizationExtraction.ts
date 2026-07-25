import { XMLParser } from "fast-xml-parser";
import { readFileSync } from "node:fs";
import { getValueAsArray } from "../../helpers.ts";
import type { FurnitureVisualization } from "../../../../../packages/game/src/Client/Interfaces/Furniture/FurnitureVisualization.ts"
import type FurnitureDataExtraction from "../FurnitureDataExtraction.ts";

export default class ManifestVisualizationExtraction {
    private readonly filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    public async execute(furnitureData: any) {
        const parser = new XMLParser({
            ignoreAttributes: false
        });

        const document = parser.parse(readFileSync(this.filePath, { encoding: "utf-8" }), true);

        let visualizationBlocks = getValueAsArray(document["visualizationData"]["graphics"]["visualization"]);

        /*const isVisualizationUseful = (visualization: any): boolean => {
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
        }*/

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
                            transitionTo: (animation["@_transitionTo"] !== undefined)?(parseInt(animation["@_transitionTo"])):(undefined),

                            layers: getValueAsArray(animation["animationLayer"]).map((layer: any) => {
                                return {
                                    id: parseInt(layer["@_id"]),
                                    loopCount: layer["@_loopCount"] ? parseInt(layer["@_loopCount"]) : undefined,
                                    frameRepeat: layer["@_frameRepeat"] ? parseInt(layer["@_frameRepeat"]) : undefined,
                                    random: layer["@_random"] === "1",

                                    frameSequence: getValueAsArray(layer["frameSequence"]).flatMap((frameSequence: any) => getValueAsArray(frameSequence?.["frame"])).map((frame: any) => {
                                        return {
                                            id: parseInt(frame["@_id"]),

                                            left: (frame["@_x"])?(parseInt(frame["@_x"])):(undefined),
                                            top: (frame["@_y"])?(parseInt(frame["@_y"])):(undefined),

                                            offsets: (frame["offsets"])?(
                                                getValueAsArray(frame["offsets"]["offset"]).map((offset: any) => {
                                                    return {
                                                        direction: parseInt(offset["@_direction"]),

                                                        left: (offset["@_x"])?(parseInt(offset["@_x"])):(undefined),
                                                        top: (offset["@_y"])?(parseInt(offset["@_y"])):(undefined),
                                                    };
                                                })
                                            ):(undefined)
                                        };
                                    })
                                }
                            })
                        }
                    }),

                    postures: getValueAsArray(visualization["postures"]?.["posture"]).map((posture: any) => {
                        return {
                            id: posture["@_id"],
                            animationId: parseInt(posture["@_animationId"])
                        };
                    }),

                    gestures: getValueAsArray(visualization["gestures"]?.["gesture"]).map((gesture: any) => {
                        return {
                            id: gesture["@_id"],
                            animationId: parseInt(gesture["@_animationId"])
                        };
                    })
                } satisfies FurnitureVisualization["visualizations"][0]
            })
        } satisfies FurnitureVisualization;
    }
}

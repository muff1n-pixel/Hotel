import { XMLParser } from "fast-xml-parser";
import { readFileSync } from "fs";
function getValueAsArray(value) {
    if (!value) {
        return [];
    }
    if (value.length) {
        return value;
    }
    return [value];
}
export function createAssetsData(collection) {
    if (!collection.data.assets) {
        throw new Error("Assets data doesn't exist.");
    }
    const parser = new XMLParser({
        ignoreAttributes: false
    });
    const document = parser.parse(readFileSync(collection.data.assets, { encoding: "utf-8" }), true);
    return document.assets.asset.map((asset) => {
        return {
            name: asset["@_name"],
            x: parseFloat(asset["@_x"]),
            y: parseFloat(asset["@_y"]),
            flipHorizontal: asset["@_flipH"] === '1',
            flipVertical: asset["@_flipV"] === '1',
        };
    });
}
export function createLogicData(collection) {
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
            directions: getValueAsArray(document["objectData"]["model"]["directions"]["direction"]).map((direction) => {
                return {
                    id: parseInt(direction["@_id"])
                };
            })
        }
    };
}
export function createVisualizationData(collection) {
    if (!collection.data.visualization) {
        throw new Error("Visualization data doesn't exist.");
    }
    const parser = new XMLParser({
        ignoreAttributes: false
    });
    const document = parser.parse(readFileSync(collection.data.visualization, { encoding: "utf-8" }), true);
    return {
        type: document["visualizationData"]["@_type"],
        visualizations: document["visualizationData"]["graphics"]["visualization"].map((visualization) => {
            var _a;
            return {
                size: parseInt(visualization["@_size"]),
                layerCount: parseInt(visualization["@_layerCount"]),
                angle: parseInt(visualization["@_angle"]),
                layers: getValueAsArray((_a = visualization["layers"]) === null || _a === void 0 ? void 0 : _a["layer"]).map((layer) => {
                    return {
                        id: parseInt(layer["@_id"]),
                        zIndex: parseInt(layer["@_id"])
                    };
                }),
                directions: getValueAsArray(visualization["directions"]["direction"]).map((direction) => {
                    return {
                        id: parseInt(direction["@_id"])
                    };
                })
            };
        })
    };
}
export function createIndexData(collection) {
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
    };
}

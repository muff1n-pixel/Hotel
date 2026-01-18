import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export async function getExistingFurnitureAssets() {
    const assetNames = readdirSync(path.join("..", "..", "assets", "furniture"), { withFileTypes: true })
        .filter((directory) => directory.isDirectory())
        .map((directory) => directory.name);

    const necessaryData = assetNames.filter((assetName) => existsSync(path.join("..", "..", "assets", "furniture", assetName, `${assetName}_serverdata.json`))).map((assetName) => {
        const furnitureData = getFurnitureData(assetName);

        const furnitureServerDatas = getFurnitureServerData(assetName);

        return furnitureServerDatas.filter((furnitureServerData: any) => furnitureServerData.flags).map((furnitureServerData: any) => {
            return {
                ...furnitureData,
                ...furnitureServerData
            };
        });
    });

    return necessaryData;
}

function getFurnitureData(assetName: string) {
    const content = readFileSync(path.join("..", "..", "assets", "furniture", assetName, `${assetName}.json`), {
        encoding: "utf-8"
    });

    const data = JSON.parse(content);

    return {
        type: data.index.type,
        dimensions: {
            row: data.logic.model.dimensions.x ?? 1,
            column: data.logic.model.dimensions.y ?? 1,
            depth: data.logic.model.dimensions.z ?? 1,
        }
    };
}

function getFurnitureServerData(assetName: string) {
    const content = readFileSync(path.join("..", "..", "assets", "furniture", assetName, `${assetName}_serverdata.json`), {
        encoding: "utf-8"
    });

    const data = JSON.parse(content);

    return data.map((item: any) => {
        return {
            name: item.name,
            description: item.description,

            color: item.color,
            placement: item.placement,

            flags: item.flags
        };
    });
}

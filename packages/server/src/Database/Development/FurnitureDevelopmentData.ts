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

function getHabboRoomContentData() {
    const content = readFileSync(path.join("..", "..", "assets", "room", "HabboRoomContent", `HabboRoomContent.json`), {
        encoding: "utf-8"
    });

    return JSON.parse(content);
}

export function getWallIds(): number[] {
    const habboRoomContentData = getHabboRoomContentData();

    return habboRoomContentData.visualization.wallData.walls.filter((wall: any) => wall.id !== "default").map((wall: any) => parseInt(wall.id));
}

export function getFloorIds(): number[] {
    const habboRoomContentData = getHabboRoomContentData();

    return habboRoomContentData.visualization.floorData.floors.filter((floor: any) => floor.id !== "default").map((floor: any) => parseInt(floor.id));
}

function getFurnitureServerData(assetName: string) {
    const content = readFileSync(path.join("..", "..", "assets", "furniture", assetName, `${assetName}_serverdata.json`), {
        encoding: "utf-8"
    });

    const data = JSON.parse(content);

    if(assetName === "wallpaper") {
        const item = data[0];

        return getWallIds().map((wallId) => {
            return {
                name: item.name,
                description: item.description,

                color: wallId,
                placement: item.placement,

                category: item.category,
                interactionType: item.interactionType,

                flags: item.flags
            };
        });
    }

    if(assetName === "floor") {
        const item = data[0];

        return getFloorIds().map((floorId) => {
            return {
                name: item.name,
                description: item.description,

                color: floorId,
                placement: item.placement,

                category: item.category,
                interactionType: item.interactionType,

                flags: item.flags
            };
        });
    }

    return data.map((item: any) => {
        return {
            name: item.name,
            description: item.description,

            color: item.color,
            placement: item.placement,

            category: item.category,
            interactionType: item.interactionType,

            flags: item.flags
        };
    });
}

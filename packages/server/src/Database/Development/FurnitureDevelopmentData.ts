import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { FurnitureModel } from "../Models/Furniture/FurnitureModel.js";
import { randomUUID } from "node:crypto";

export async function createMissingFurniture() {
    const existingFurnitureAssets = await getExistingFurnitureAssets();

    await FurnitureModel.bulkCreate(existingFurnitureAssets.flatMap((furnitures) => furnitures).map((furniture) => {
        return {
            id: randomUUID(),
            type: furniture.type,

            name: furniture.name,
            description: furniture.description,

            flags: furniture.flags,

            color: furniture.color,
            placement: furniture.placement,
            dimensions: furniture.dimensions,

            category: furniture.category,
            interactionType: furniture.interactionType,
            customParams: furniture.customParams
        };
    }), {
        ignoreDuplicates: true
    });
}

export async function getExistingFurnitureAssets(filter: ((assetName: string) => boolean) = ((assetName: string) => true)) {
    const assetNames = readdirSync(path.join("..", "..", "assets", "furniture"), { withFileTypes: true })
        .filter((directory) => directory.isDirectory())
        .map((directory) => directory.name)
        .filter(filter);

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
    try {
        const content = readFileSync(path.join("..", "..", "assets", "room", "HabboRoomContent", `HabboRoomContent.json`), {
            encoding: "utf-8"
        });

        return JSON.parse(content);
    } catch (error) {
        return null;
    }
}

export function getWallIds(): number[] {
    const habboRoomContentData = getHabboRoomContentData();

    if(habboRoomContentData === null)
        return [];

    return habboRoomContentData.visualization.wallData.walls.filter((wall: any) => !isNaN(parseInt(wall.id))).map((wall: any) => parseInt(wall.id));
}

export function getFloorIds(): number[] {
    const habboRoomContentData = getHabboRoomContentData();

    if(habboRoomContentData === null)
        return [];

    return habboRoomContentData.visualization.floorData.floors.filter((floor: any) => !isNaN(parseInt(floor.id))).map((floor: any) => parseInt(floor.id));
}

function getFurnitureServerData(assetName: string) {
    const content = readFileSync(path.join("..", "..", "assets", "furniture", assetName, `${assetName}_serverdata.json`), {
        encoding: "utf-8"
    });

    const data = JSON.parse(content);

    if (assetName === "wallpaper") {
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

    if (assetName === "floor") {
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

            flags: item.flags,
            customParams: item.customParams
        };
    });
}

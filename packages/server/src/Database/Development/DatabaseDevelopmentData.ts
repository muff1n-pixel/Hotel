import { RoomFurnitureModel } from "../Models/Rooms/RoomFurnitureModel.js";
import { RoomModel } from "../Models/Rooms/RoomModel.js";
import { randomUUID } from "crypto";
import { ShopPageModel } from "../Models/Shop/ShopPageModel.js";
import { ShopPageFurnitureModel } from "../Models/Shop/ShopPageFurnitureModel.js";
import { FurnitureModel } from "../Models/Furniture/FurnitureModel.js";
import { getExistingFurnitureAssets } from "./FurnitureDevelopmentData.js";
import { UserModel } from "../Models/Users/UserModel.js";
import { UserFurnitureModel } from "../Models/Users/Furniture/UserFurnitureModel.js";

export async function initializeDevelopmentData() {
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
            dimensions: furniture.dimensions
        };
    }));

    const typeCategory = await ShopPageModel.create<ShopPageModel>({
        id: randomUUID(),
        category: "furniture",
        title: "By type",
        description: "Lalallala",

        icon: "icon_72.png",
        header: "catalog_frontpage_headline_shop_EN.gif"
    });

    const shopPages = await ShopPageModel.bulkCreate<ShopPageModel>([
        {
            id: randomUUID(),
            category: "furniture",
            title: "Something"
        },
        {
            id: randomUUID(),
            category: "furniture",
            title: "Accessories",
            parentId: typeCategory.id,
        },
        {
            id: randomUUID(),
            category: "furniture",
            title: "Rugs",
            parentId: typeCategory.id
        },
        {
            id: randomUUID(),
            category: "furniture",
            title: "Dimmers",
            parentId: typeCategory.id
        }
    ]);

    await ShopPageFurnitureModel.bulkCreate<ShopPageFurnitureModel>([
        {
            id: randomUUID(),
            furnitureId: (await FurnitureModel.findOne({ where: { type: "rare_dragonlamp", color: 1 } }))!.id,
            shopPageId: typeCategory.id,
        },
        {
            id: randomUUID(),
            furnitureId: (await FurnitureModel.findOne({ where: { type: "rare_dragonlamp", color: 2 } }))!.id,
            shopPageId: typeCategory.id
        },
        {
            id: randomUUID(),
            furnitureId: (await FurnitureModel.findOne({ where: { type: "rare_dragonlamp", color: 3 } }))!.id,
            shopPageId: typeCategory.id
        },
        {
            id: randomUUID(),
            furnitureId: (await FurnitureModel.findOne({ where: { type: "rare_dragonlamp", color: 4 } }))!.id,
            shopPageId: typeCategory.id
        },
        {
            id: randomUUID(),
            furnitureId: (await FurnitureModel.findOne({ where: { type: "rare_dragonlamp", color: 5 } }))!.id,
            shopPageId: typeCategory.id
        }
    ]);

    const allFurnitureShopPage = await ShopPageModel.create({
        id: randomUUID(),
        category: "furniture",
        title: "All furniture"
    });

    await ShopPageFurnitureModel.bulkCreate<ShopPageFurnitureModel>((await FurnitureModel.findAll()).map((furniture) => {
        return {
            id: randomUUID(),
            furnitureId: furniture.id,
            shopPageId: allFurnitureShopPage.id
        };
    }));

    await RoomModel.create<RoomModel>({
        id: "room2",
        name: "My room",
        structure: {
            door: {
                row: 0,
                column: 2
            },
            grid: [
                "XX0XXXX",
                "0000000",
                "0000000",
                "0000000",
                "0000000",
                "0000000",
                "0000000"
            ],
            floor: {
                id: "default",
                thickness: 8
            },
            wall: {
                id: "default",
                thickness: 8
            }
        }
    });

    const room = await RoomModel.create<RoomModel>({
        id: "room1",
        name: "My home room",
        structure: {
            door: {
                row: 6,
                column: 0
            },
            grid: [
                "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                "X22222222222222222222222XX22222222222222222222222X",
                "X22222222222222222222222XX22222222222222222222222X",
                "X22222222222222222222222XX22222222222222222222222X",
                "X22222222222222222222222XX22222222222222222222222X",
                "X22222222222222222222222XX22222222222222222222222X",
                "222222222222222222222222XX22222222222222222222222X",
                "X22222222222222222222222XX22222222222222222222222X",
                "X22222222222222222222222XX22222222222222222222222X",
                "X22222222222222222222222XX22222222222222222222222X",
                "X11111111111111111111111XX11111111111111111111111X",
                "X11111111111111111111111XX11111111111111111111111X",
                "X11111111111111111111111XX11111111111111111111111X",
                "X11111111111111111111111XX11111111111111111111111X",
                "X11111111111111111111111XX11111111111111111111111X",
                "X11111111111111111111111XX11111111111111111111111X",
                "X11111111111111111111111XX11111111111111111111111X",
                "X11111111111111111111111XX11111111111111111111111X",
                "X11111111111111111111111XX11111111111111111111111X",
                "X11111111111111111111111XX11111111111111111111111X",
                "X00000000000000000000000XX00000000000000000000000X",
                "X00000000000000000000000XX00000000000000000000000X",
                "X00000000000000000000000XX00000000000000000000000X",
                "X00000000000000000000000XX00000000000000000000000X",
                "X00000000000000000000000XX00000000000000000000000X",
                "X00000000000000000000000XX00000000000000000000000X",
                "X00000000000000000000000XX00000000000000000000000X",
                "X00000000000000000000000XX00000000000000000000000X",
                "X00000000000000000000000XX00000000000000000000000X",
                "XXXXXXXXXXX000XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                "XXXXXXXXXXX000XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                "XXXXXXXXXXX000XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                "XXXXXXXXXXX000XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                "XXXXXXXXXXX000XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                "XXXXXXXXXXX000XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                "XXXXXXXXXXX000XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                "XXXXXXXXXXX000XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                "X00000000000000000000000XXXXXXXXXXXXXXXXXXXXXXXXXX",
                "X00000000000000000000000XXXXXXXXXXXXXXXXXXXXXXXXXX",
                "X00000000000000000000000XXXXXXXXXXXXXXXXXXXXXXXXXX",
                "X00000000000000000000000XXXXXXXXXXXXXXXXXXXXXXXXXX",
                "X00000000000000000000000XXXXXXXXXXXXXXXXXXXXXXXXXX",
                "X00000000000000000000000XXXXXXXXXXXXXXXXXXXXXXXXXX",
                "X00000000000000000000000XXXXXXXXXXXXXXXXXXXXXXXXXX",
                "X00000000000000000000000XXXXXXXXXXXXXXXXXXXXXXXXXX",
                "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX0"
            ],
            floor: {
                id: "101",
                thickness: 8
            },
            wall: {
                id: "2301",
                thickness: 8
            }
        }
    });

    const furniture = (await FurnitureModel.findOne({ where: { type: "rare_dragonlamp", color: 1 } }));

    for (let color = 0; color < 3; color++)
        for (let direction = 0; direction < 2; direction++)
            for (let index = 0; index < 20; index++) {
                await RoomFurnitureModel.create<RoomFurnitureModel>({
                    id: randomUUID(),
                    roomId: room.id,
                    furnitureId: furniture!.id,
                    position: {
                        row: (11 + (color * 2)) + direction,
                        column: 1 + index,
                        depth: 1
                    },
                    direction: (direction === 0) ? (2) : (4),
                    animation: 1
                });
            }

    const user = await UserModel.create({
        id: "user1",
        name: "Muff1n-Pixel",
        figureConfiguration: [{ "type": "hd", "setId": "180", "colorIndex": 2 }, { "type": "hr", "setId": "828", "colorIndex": 31 }, { "type": "ea", "setId": "3196", "colorIndex": 62 }, { "type": "ch", "setId": "255", "colorIndex": 1415 }, { "type": "lg", "setId": "3216", "colorIndex": 110 }, { "type": "sh", "setId": "305", "colorIndex": 62 }]
    });

    await UserFurnitureModel.bulkCreate([
        {
            id: randomUUID(),
            userId: user.id,
            furnitureId: furniture!.id
        },
        {
            id: randomUUID(),
            userId: user.id,
            furnitureId: (await FurnitureModel.findOne({ where: { type: "rare_dragonlamp", color: 2 } }))!.id
        },
        {
            id: randomUUID(),
            userId: user.id,
            furnitureId: (await FurnitureModel.findOne({ where: { type: "roomdimmer" } }))!.id
        }
    ]);

    await UserModel.create({
        id: "user2",
        name: "Cake",
        figureConfiguration: [{ "type": "hd", "setId": "180", "colorIndex": 2 }, { "type": "hr", "setId": "828", "colorIndex": 31 }, { "type": "ch", "setId": "255", "colorIndex": 1415 }, { "type": "lg", "setId": "3216", "colorIndex": 110 }, { "type": "sh", "setId": "305", "colorIndex": 62 }]
    });
}

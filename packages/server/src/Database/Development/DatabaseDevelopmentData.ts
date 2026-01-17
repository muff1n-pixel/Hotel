import { DataTypes, Sequelize, UUIDV4 } from "sequelize";
import "../Models/Rooms/Room.js";
import { initializeRoomFurnitureModel, RoomFurniture } from "../Models/Rooms/RoomFurniture.js";
import { initializeRoomModel, Room } from "../Models/Rooms/Room.js";
import { randomUUID } from "crypto";
import { initializeShopPageModel, ShopPage } from "../Models/Shop/ShopPage.js";
import { initializeShopPageFurnitureModel, ShopPageFurniture } from "../Models/Shop/ShopPageFurniture.js";
import { Furniture, initializeFurnitureModel } from "../Models/Furniture/Furniture.js";
import { getExistingFurnitureAssets } from "./FurnitureDevelopmentData.js";
import { User } from "../Models/Users/User.js";
import { UserFurniture } from "../Models/Users/Furniture/UserFurniture.js";

export async function initializeDevelopmentData() {
    const existingFurnitureAssets = await getExistingFurnitureAssets();

    await Furniture.bulkCreate<Furniture>(existingFurnitureAssets.flatMap((furnitures) => furnitures).map((furniture) => {
        return {
            id: randomUUID(),
            type: furniture.type,

            name: furniture.name,
            description: furniture.description,

            color: furniture.color,
            placement: furniture.placement,
            dimensions: furniture.dimensions
        };
    }));

    const typeCategory = await ShopPage.create<ShopPage>({
        id: randomUUID(),
        category: "furniture",
        title: "By type",
        description: "Lalallala",

        icon: "icon_72.png",
        header: "catalog_frontpage_headline_shop_EN.gif"
    });

    const shopPages = await ShopPage.bulkCreate<ShopPage>([
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

    await ShopPageFurniture.bulkCreate<ShopPageFurniture>([
        {
            id: randomUUID(),
            furnitureId: (await Furniture.findOne({ where: { type: "rare_dragonlamp", color: 1 } }))!.id,
            shopPageId: typeCategory.id,
        },
        {
            id: randomUUID(),
            furnitureId: (await Furniture.findOne({ where: { type: "rare_dragonlamp", color: 2 } }))!.id,
            shopPageId: typeCategory.id
        },
        {
            id: randomUUID(),
            furnitureId: (await Furniture.findOne({ where: { type: "rare_dragonlamp", color: 3 } }))!.id,
            shopPageId: typeCategory.id
        },
        {
            id: randomUUID(),
            furnitureId: (await Furniture.findOne({ where: { type: "rare_dragonlamp", color: 4 } }))!.id,
            shopPageId: typeCategory.id
        },
        {
            id: randomUUID(),
            furnitureId: (await Furniture.findOne({ where: { type: "rare_dragonlamp", color: 5 } }))!.id,
            shopPageId: typeCategory.id
        }
    ]);

    const allFurnitureShopPage = await ShopPage.create({
        id: randomUUID(),
        category: "furniture",
        title: "All furniture"
    });

    await ShopPageFurniture.bulkCreate<ShopPageFurniture>((await Furniture.findAll()).map((furniture) => {
        return {
            id: randomUUID(),
            furnitureId: furniture.id,
            shopPageId: allFurnitureShopPage.id
        };
    }));

    await Room.create<Room>({
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
                id: "101",
                thickness: 8
            },
            wall: {
                id: "2301",
                thickness: 8
            }
        }
    });

    const room = await Room.create<Room>({
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

    const furniture = (await Furniture.findOne({ where: { type: "rare_dragonlamp", color: 1 } }));

    for (let color = 0; color < 3; color++)
        for (let direction = 0; direction < 2; direction++)
            for (let index = 0; index < 20; index++) {
                await RoomFurniture.create<RoomFurniture>({
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

    const user = await User.create({
        id: "user1",
        name: "Muff1n-Pixel",
        figureConfiguration: [{ "type": "hd", "setId": "180", "colorIndex": 2 }, { "type": "hr", "setId": "828", "colorIndex": 31 }, { "type": "ea", "setId": "3196", "colorIndex": 62 }, { "type": "ch", "setId": "255", "colorIndex": 1415 }, { "type": "lg", "setId": "3216", "colorIndex": 110 }, { "type": "sh", "setId": "305", "colorIndex": 62 }]
    });

    await UserFurniture.bulkCreate([
        {
            id: randomUUID(),
            userId: user.id,
            furnitureId: furniture!.id
        },
        {
            id: randomUUID(),
            userId: user.id,
            furnitureId: (await Furniture.findOne({ where: { type: "rare_dragonlamp", color: 2 } }))!.id
        },
        {
            id: randomUUID(),
            userId: user.id,
            furnitureId: (await Furniture.findOne({ where: { type: "roomdimmer" } }))!.id
        }
    ]);

    await User.create({
        id: "user2",
        name: "Cake",
        figureConfiguration: [{ "type": "hd", "setId": "180", "colorIndex": 2 }, { "type": "hr", "setId": "828", "colorIndex": 31 }, { "type": "ch", "setId": "255", "colorIndex": 1415 }, { "type": "lg", "setId": "3216", "colorIndex": 110 }, { "type": "sh", "setId": "305", "colorIndex": 62 }]
    });
}

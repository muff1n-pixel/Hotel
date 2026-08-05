import { QueryInterface, DataTypes, Op, QueryTypes } from 'sequelize';
import type { Migration } from "sequelize-cli";
import { getExistingFurnitureAssets } from '../Development/FurnitureDevelopmentData.js';
import { randomUUID } from 'node:crypto';

const assets = [
    "room_wl15_telehc",
    "room_wl15_teleblock",
    "room_wl15_bthdoor",
    "room_wl15_sofa",
    "room_wl15_toilet",
    "room_wlof15_bookcase",
    "room_wlof15_wardrobe",
    "room_wl15_mirror",
    "room_wlof15_chair",
    "room_wl15_table2",
    "room_wl15_deskfront",
    "room_wl15_deskgate",
    "room_wl15_toiletbroke",
    "room_wl15_table3",
    "room_wl15_trashbin",
    "room_wl15_pillar",
    "room_wl15_infolink",
    "room_wl15_tree",
    "room_wlof15_bed",
    "room_wl15_sink",
    "room_wl15_mag1",
    "room_wl15_ele",
    "room_wl15_table1"
].map((type) => {
    return {
        type,
        color: null,

        credits: 3,
        duckets: null,
        diamonds: null
    };
});

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            const furnitureDatas = await getExistingFurnitureAssets((assetName) => assets.some((asset) => asset.type === assetName));

            await queryInterface.bulkInsert("furnitures", furnitureDatas.flatMap((furnitures) => furnitures).map((furniture) => {
                return {
                    id: randomUUID(),
                    type: furniture.type,
        
                    name: furniture.name,
                    description: furniture.description,
        
                    flags: JSON.stringify(furniture.flags),
        
                    color: furniture.color ?? null,
                    placement: furniture.placement,
                    dimensions: JSON.stringify(furniture.dimensions),
        
                    category: furniture.category,
                    interactionType: furniture.interactionType,
        
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
            }), {
                type: QueryTypes.INSERT,
                transaction
            });

            const rootShopPageId = randomUUID();

            await queryInterface.insert(null, "shop_pages", {
                id: rootShopPageId,
                index: 30,

                type: "default",

                category: "furniture",
                title: "Public Rooms",
                description: null,

                icon: "icon_225.png",
                header: null,
                teaser: null,
        
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                transaction
            });

            const shopPageId = randomUUID();

            await queryInterface.insert(null, "shop_pages", {
                id: shopPageId,
                parentId: rootShopPageId,
                index: 0,

                type: "default",

                category: "furniture",
                title: "Welcome Room",
                description: null,

                icon: "icon_225.png",
                header: null,
                teaser: null,
        
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                transaction
            });

            const furniture = await queryInterface.select(null, "furnitures", {
                where: {
                    type: {
                        [Op.in]: assets.map((asset) => asset.type)
                    }
                },
                transaction
            });

            await queryInterface.bulkInsert("shop_page_furnitures", furniture.map((furniture: any) => {
                const furnitureShopData = assets.find((childFurniture: any) => childFurniture.type === furniture.type && ((furniture.color)?(childFurniture.color === furniture.color):(true)));

                return {
                    id: randomUUID(),
                    furnitureId: furniture.id,
                    shopPageId: shopPageId,

                    credits: furnitureShopData!.credits,
                    duckets: furnitureShopData!.duckets,
                    diamonds: furnitureShopData!.diamonds,
        
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
            }), {
                transaction
            })
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            const furniture = await queryInterface.select(null, "furnitures", {
                where: {
                    type: {
                        [Op.in]: assets.map((asset) => asset.type)
                    }
                },
                transaction
            });

            await queryInterface.bulkDelete("shop_page_furnitures", {
              furnitureId: {
                [Op.in]: furniture.map((furniture: any) => furniture.id)
              }
            }, {
                transaction
            });

            await queryInterface.bulkDelete("furnitures", {
              id: {
                [Op.in]: furniture.map((furniture: any) => furniture.id)
              }
            }, {
                transaction
            });

            await queryInterface.bulkDelete("shop_pages", {
                title: "Welcome Room"
            }, {
                transaction
            });

            await queryInterface.bulkDelete("shop_pages", {
                title: "Public Rooms"
            }, {
                transaction
            });
        }
    )
} satisfies Migration;

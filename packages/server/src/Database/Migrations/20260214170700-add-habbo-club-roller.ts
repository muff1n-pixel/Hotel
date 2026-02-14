import { QueryInterface, DataTypes, QueryTypes, Op } from 'sequelize';
import type { Migration } from "sequelize-cli";
import { getExistingFurnitureAssets } from '../Development/FurnitureDevelopmentData.js';
import { randomUUID } from 'node:crypto';

const assets = [
    {
        type: "hc_rllr",
        color: null,

        credits: 12,
        duckets: null,
        diamonds: null
    }
];

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
            
            const furniture = await queryInterface.select(null, "furnitures", {
                where: {
                    type: {
                        [Op.in]: assets.map((asset) => asset.type)
                    }
                },
                transaction
            });
            
            const shopPages = await queryInterface.select(null, "shop_pages", {
                where: {
                    title: "Habbo Club"
                },
                transaction
            });
            const shopPage = shopPages[0];

            if(!shopPage) {
                throw new Error("Shop page does not exist.");
            }
            
            await queryInterface.bulkInsert("shop_page_furnitures", furniture.map((furniture: any) => {
                const furnitureShopData = assets.find((childFurniture: any) => childFurniture.type === furniture.type && ((furniture.color)?(childFurniture.color === furniture.color):(true)));

                return {
                    id: randomUUID(),
                    furnitureId: furniture.id,
                    shopPageId: (shopPage as any).id,

                    credits: furnitureShopData!.credits,
                    duckets: furnitureShopData!.duckets,
                    diamonds: furnitureShopData!.diamonds,
        
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
            }), {
                transaction
            });
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
        }
    )
} satisfies Migration;

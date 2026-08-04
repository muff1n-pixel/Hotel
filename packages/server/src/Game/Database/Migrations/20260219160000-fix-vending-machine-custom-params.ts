import { QueryInterface, DataTypes, Op, QueryTypes } from 'sequelize';
import type { Migration } from "sequelize-cli";
import { getExistingFurnitureAssets } from '../Development/FurnitureDevelopmentData.js';

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            const furnitures = await queryInterface.select(null, "furnitures", {
                where: {
                    interactionType: "vendingmachine"
                },
                transaction
            });

            const assetNames = (furnitures as any[]).map((furniture) => furniture.type);

            const furnitureDatas = (await getExistingFurnitureAssets((assetName) => assetNames.includes(assetName))).flatMap((item) => item);

            for(const furniture of furnitureDatas) {
                await queryInterface.bulkUpdate("furnitures", {
                    customParams: furniture.customParams,
                }, {
                    type: furniture.type,
                    color: furniture.color ?? null,
                }, {
                    transaction
                });
            }
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
        }
    )
} satisfies Migration;

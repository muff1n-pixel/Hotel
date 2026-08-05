import { Op, QueryInterface, QueryTypes } from 'sequelize';
import type { Migration } from "sequelize-cli";
import { getExistingFurnitureAssets } from '../Development/FurnitureDevelopmentData.js';
import { randomUUID } from 'node:crypto';

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            const furnitureDatas = await getExistingFurnitureAssets((assetName) => ["wf_trg_periodically"].includes(assetName));

            await queryInterface.bulkInsert("furnitures", furnitureDatas.flatMap((furnitures) => furnitures).map((furniture) => {
                return {
                    id: randomUUID(),
                    type: "wf_trg_period_short",
        
                    name: "WIRED Trigger: Repeat Effect (Short)",
                    description: furniture.description,
        
                    flags: JSON.stringify(furniture.flags),
        
                    color: furniture.color ?? null,
                    placement: furniture.placement,
                    dimensions: JSON.stringify(furniture.dimensions),
        
                    category: "wired",
                    interactionType: "wf_trg_period_short",
        
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
            }), {
                type: QueryTypes.INSERT,
                transaction
            });
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.bulkDelete("furnitures", {
                where: {
                    type: {
                        [Op.in]: ["wf_trg_period_short"]
                    }
                },
                transaction
            });
        }
    )
} satisfies Migration;

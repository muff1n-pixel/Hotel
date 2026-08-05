import { Op, QueryInterface, QueryTypes } from 'sequelize';
import type { Migration } from "sequelize-cli";
import { getExistingFurnitureAssets } from '../Development/FurnitureDevelopmentData.js';
import { randomUUID } from 'node:crypto';

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            const furnitureDatas = await getExistingFurnitureAssets((assetName) => ["wf_antenna1", "wf_antenna2"].includes(assetName));

            await queryInterface.bulkInsert("furnitures", furnitureDatas.flatMap((furnitures) => furnitures).map((furniture) => {
                return {
                    id: randomUUID(),
                    type: furniture.type,
        
                    name: furniture.name ?? furniture.type,
                    description: furniture.description,
        
                    flags: JSON.stringify(furniture.flags),
        
                    color: furniture.color ?? null,
                    placement: furniture.placement,
                    dimensions: JSON.stringify(furniture.dimensions),
        
                    category: "wired",
                    interactionType: "wf_atenna",
        
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
            const furniture = await queryInterface.select(null, "furnitures", {
                where: {
                    type: {
                        [Op.in]: ["wf_antenna1", "wf_antenna2"]
                    }
                },
                transaction
            });
        }
    )
} satisfies Migration;

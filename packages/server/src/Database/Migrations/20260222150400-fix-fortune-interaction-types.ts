import { DataTypes, Op, QueryInterface } from 'sequelize';
import type { Migration } from "sequelize-cli";

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            const furniture = await queryInterface.select(null, "furnitures", {
                where: {
                    category: "fortuna",
                    interactionType: "default"
                },
                transaction
            });

            await queryInterface.bulkUpdate("furnitures", {
                interactionType: "fortuna"
            }, {
                id: {
                    [Op.in]: furniture.map((furniture: any) => furniture.id)
                }
            }, { transaction });
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            const furniture = await queryInterface.select(null, "furnitures", {
                where: {
                    category: "fortuna",
                    interactionType: "fortuna"
                },
                transaction
            });

            await queryInterface.bulkUpdate("furnitures", {
                interactionType: "default"
            }, {
                id: {
                    [Op.in]: furniture.map((furniture: any) => furniture.id)
                }
            }, { transaction });
        }
    )
} satisfies Migration;

import { randomUUID } from "node:crypto";
import { QueryInterface, DataTypes, Op, QueryTypes } from "sequelize";
import type { Migration } from "sequelize-cli";

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.addConstraint("furnitures", {
                fields: ["type", "color"],
                type: "unique",
                name: "unique_type_color",
                transaction
            });
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.removeConstraint("furnitures", "unique_type_color", {
                transaction
            });
        }
    )
} satisfies Migration;

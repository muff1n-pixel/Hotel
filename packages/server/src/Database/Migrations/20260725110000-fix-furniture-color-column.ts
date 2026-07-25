import { QueryInterface, DataTypes } from "sequelize";
import type { Migration } from "sequelize-cli";

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.changeColumn("furnitures", "color", DataTypes.STRING);
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.changeColumn("furnitures", "color", DataTypes.INTEGER);
        }
    )
} satisfies Migration;

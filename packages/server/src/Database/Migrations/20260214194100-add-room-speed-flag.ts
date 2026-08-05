import { QueryInterface, DataTypes } from 'sequelize';
import type { Migration } from "sequelize-cli";

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.addColumn("rooms", "speed", {
                type: DataTypes.FLOAT,
                defaultValue: 1,
                allowNull: false,
            }, {
                transaction
            });
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.removeColumn("rooms", "speed", { transaction });
        }
    )
} satisfies Migration;

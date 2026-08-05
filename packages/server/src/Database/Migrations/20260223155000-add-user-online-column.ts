import { QueryInterface, DataTypes } from 'sequelize';
import type { Migration } from "sequelize-cli";

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.addColumn("users", "online", {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }, {
                transaction
            });
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.removeColumn("users", "online", { transaction });
        }
    )
} satisfies Migration;

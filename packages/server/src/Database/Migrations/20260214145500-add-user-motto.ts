import { QueryInterface, DataTypes } from 'sequelize';
import type { Migration } from "sequelize-cli";

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.addColumn("users", "motto", {
                type: new DataTypes.STRING(40),
                allowNull: true,
                defaultValue: "I am new to Pixel63!"
            }, {
                transaction
            });
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.removeColumn("users", "motto", { transaction });
        }
    )
} satisfies Migration;

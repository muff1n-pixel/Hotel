import { QueryInterface, DataTypes } from 'sequelize';
import type { Migration } from "sequelize-cli";

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.addColumn("user_preferences", "allowTrade", {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }, {
                transaction
            });
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.removeColumn("user_preferences", "allowTrade", {
                transaction
            });
        }
    )
} satisfies Migration;

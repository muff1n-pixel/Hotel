import { QueryInterface, DataTypes } from 'sequelize';
import type { Migration } from "sequelize-cli";

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.addColumn("rooms", "currentUsers", {
                type: new DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            }, {
                transaction
            });
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.removeColumn("rooms", "currentUsers", {
                transaction
            });
        }
    )
} satisfies Migration;

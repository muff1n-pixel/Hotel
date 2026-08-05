import { DataTypes, QueryInterface } from 'sequelize';
import type { Migration } from "sequelize-cli";

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.changeColumn("user_furnitures", "color", {
                type: DataTypes.INTEGER,
                defaultValue: null,
                allowNull: true
            }, {
                transaction
            });

            await queryInterface.bulkUpdate("user_furnitures", {
                color: null
            }, {}, {
                transaction
            });
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.changeColumn("user_furnitures", "color", {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            }, { transaction });
        }
    )
} satisfies Migration;

import { randomUUID } from 'node:crypto';
import { QueryInterface, DataTypes, Op, QueryTypes } from 'sequelize';
import type { Migration } from "sequelize-cli";

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.addColumn("rooms", "lock", {
                type: DataTypes.STRING,
                defaultValue: "open",
                allowNull: false
            }, {
                transaction
            });

            await queryInterface.addColumn("rooms", "password", {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null
            }, {
                transaction
            });
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.removeColumn("rooms", "lock", { transaction });
            await queryInterface.removeColumn("rooms", "password", { transaction });
        }
    )
} satisfies Migration;

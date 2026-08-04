import { randomUUID } from 'node:crypto';
import { QueryInterface, DataTypes, Op, QueryTypes } from 'sequelize';
import type { Migration } from "sequelize-cli";

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.addColumn("rooms", "type", {
                type: DataTypes.STRING,
                defaultValue: "private",
                allowNull: false
            }, {
                transaction
            });

            await queryInterface.addColumn("room_categories", "developer", {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false
            }, { transaction });

            await queryInterface.insert(null, "room_categories", {
                id: randomUUID(),
                title: "Official Rooms",
                developer: true,
                updatedAt: new Date(),
                createdAt: new Date()
            }, {
                transaction
            });
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.removeColumn("rooms", "type", { transaction });
            
            await queryInterface.removeColumn("room_categories", "developer", { transaction });

            await queryInterface.delete(null, "room_categories", {
                title: "Official Rooms"
            }, {
                transaction
            });
        }
    )
} satisfies Migration;

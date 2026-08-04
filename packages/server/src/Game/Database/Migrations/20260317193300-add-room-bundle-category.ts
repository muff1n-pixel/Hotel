import { randomUUID } from 'node:crypto';
import { QueryInterface } from 'sequelize';
import type { Migration } from "sequelize-cli";

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.insert(null, "room_categories", {
                id: randomUUID(),
                title: "Room Bundles",
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
            await queryInterface.delete(null, "room_categories", {
                title: "Room Bundles"
            }, {
                transaction
            });
        }
    )
} satisfies Migration;

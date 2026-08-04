import { randomUUID } from 'node:crypto';
import { QueryInterface, DataTypes } from 'sequelize';
import type { Migration } from "sequelize-cli";
import { RoomCategoryModel } from '../Models/Rooms/Categories/RoomCategoryModel';

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.dropTable("room_categories");

            await queryInterface.createTable("room_categories", {
                id: {
                    type: DataTypes.STRING(64),
                    primaryKey: true
                },
                title: {
                    type: DataTypes.TEXT,
                    allowNull: false
                },
                updatedAt: {
                    type: DataTypes.DATE
                },
                createdAt: {
                    type: DataTypes.DATE
                }
            });

            await queryInterface.bulkInsert("room_categories",
                [
                    "Personal Space",
                    "Agencies",
                    "Chat and discussion",
                    "Habbo Games",
                    "Role Playing",
                    "Building and decoration",
                    "Party",
                    "Fansite Square",
                    "Help Centers",
                    "Trading"
                ].map((title) => {
                    return {
                        id: randomUUID(),
                        title,
                        updatedAt: new Date(),
                        createdAt: new Date()
                    };
                })
            );

            const defaultCategories = await queryInterface.select(null, "room_categories", {
                where: {
                    title: "Chat and discussion"
                }
            });

            const defaultCategory = defaultCategories[0];

            if(!defaultCategory) {
                throw new Error("Default category was not found.");
            }

            await queryInterface.addColumn("rooms", "categoryId", {
                type: DataTypes.STRING(64),
                allowNull: false,
                defaultValue: (defaultCategory as any).id,
                references: {
                    model: "room_categories",
                    key: "id"
                }
            });
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.removeColumn("rooms", "categoryId");

            await queryInterface.dropTable("room_categories");
        }
    )
} satisfies Migration;

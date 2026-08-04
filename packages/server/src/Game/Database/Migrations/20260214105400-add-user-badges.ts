import { QueryInterface, DataTypes, Op, QueryTypes } from 'sequelize';
import type { Migration } from "sequelize-cli";
import { getBadgeDatas } from '../Development/BadgeDevelopmentData.js';

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.createTable("badges", {
                id: {
                    type: new DataTypes.STRING(32),
                    primaryKey: true
                },
                name: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                image: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                updatedAt: {
                    type: DataTypes.DATE
                },
                createdAt: {
                    type: DataTypes.DATE
                }
            }, {
                transaction
            });

            const badges = getBadgeDatas();

            await queryInterface.bulkInsert("badges", badges.map((badge) => {
                return {
                    id: badge.id,
                    name: badge.name ?? null,
                    description: badge.description ?? null,
                    image: badge.image,
                    updatedAt: new Date(),
                    createdAt: new Date()
                };
            }), {
                transaction
            })

            await queryInterface.createTable("user_badges", {
                id: {
                    type: DataTypes.STRING(64),
                    primaryKey: true
                },
                userId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    references: {
                        model: "users",
                        key: "id"
                    }
                },
                badgeId: {
                    type: new DataTypes.STRING(32),
                    allowNull: false,
                    references: {
                        model: "badges",
                        key: "id"
                    }
                },
                equipped: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false
                },
                updatedAt: {
                    type: DataTypes.DATE
                },
                createdAt: {
                    type: DataTypes.DATE
                }
            }, {
                transaction
            });
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.dropTable("user_badges", { transaction });
            await queryInterface.dropTable("badges", { transaction });
        }
    )
} satisfies Migration;

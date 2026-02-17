import { randomUUID } from "node:crypto";
import { QueryInterface, DataTypes, Op, QueryTypes } from "sequelize";
import type { Migration } from "sequelize-cli";

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.insert(null, "permissions", {
                id: "shop:edit",
                updatedAt: new Date(),
                createdAt: new Date()
            }, { transaction });

            await queryInterface.insert(null, "permission_roles", {
                id: "developer",
                updatedAt: new Date(),
                createdAt: new Date()
            }, { transaction });

            await queryInterface.insert(null, "role_permissions", {
                roleId: "developer",
                permissionId: "shop:edit",
                updatedAt: new Date(),
                createdAt: new Date()
            }, { transaction });

            const developerUsers = await queryInterface.select(null, "users", {
                where: {
                    developer: true
                },
                transaction
            });

            await queryInterface.bulkInsert("user_roles", developerUsers.map((user: any) => {
                return {
                    userId: user.id,
                    roleId: "developer",
                    updatedAt: new Date(),
                    createdAt: new Date()
                }
            }), { transaction });
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.bulkDelete("user_roles", {
                roleId: "developer"
            }, { transaction });

            await queryInterface.bulkDelete("role_permissions", {
                roleId: "developer"
            }, { transaction });

            await queryInterface.bulkDelete("permissions", {
                id: "shop:edit"
            }, { transaction });

            await queryInterface.bulkDelete("permission_roles", {
                id: "developer"
            }, { transaction });
        }
    )
} satisfies Migration;

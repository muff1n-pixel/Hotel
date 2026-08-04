import { PermissionAction } from "@shared/Interfaces/Permissions/PermissionMap";
import { QueryInterface, Op } from "sequelize";
import type { Migration } from "sequelize-cli";

const permissions: PermissionAction[] = [
    "command:give",
];

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.bulkInsert("permissions", permissions.map((action) => {
                return {
                    id: action,
                    updatedAt: new Date(),
                    createdAt: new Date()
                };
            }), { transaction });

            await queryInterface.bulkInsert("role_permissions", permissions.map((action) => {
                return {
                    roleId: "developer",
                    permissionId: action,
                    updatedAt: new Date(),
                    createdAt: new Date()
                };
            }), { transaction });
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.bulkDelete("role_permissions", {
                roleId: "developer",
                permissionId: {
                    [Op.in]: permissions
                }
            }, { transaction });

            await queryInterface.bulkDelete("permissions", {
                id: {
                    [Op.in]: permissions
                }
            }, { transaction });
        }
    )
} satisfies Migration;

import { randomUUID } from "node:crypto";
import { QueryInterface, DataTypes, Op, QueryTypes } from "sequelize";
import type { Migration } from "sequelize-cli";

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.changeColumn("shop_pages", "description", new DataTypes.STRING(512), { transaction });
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.changeColumn("shop_pages", "description", new DataTypes.STRING, { transaction });
        }
    )
} satisfies Migration;

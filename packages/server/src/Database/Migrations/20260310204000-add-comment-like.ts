import { QueryInterface, DataTypes } from 'sequelize';
import type { Migration } from "sequelize-cli";

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.addColumn("web_article_likes", "commentId", {
                type: DataTypes.UUID,
                allowNull: true,
                defaultValue: null
            }, {
                transaction
            });
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.removeColumn("web_article_likes", "commentId", { transaction });
        }
    )
} satisfies Migration;

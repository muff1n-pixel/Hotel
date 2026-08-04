import { Op, QueryInterface } from 'sequelize';
import type { Migration } from "sequelize-cli";

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.bulkUpdate("furnitures", {
                interactionType: "sound_set"
            }, {
                type: {
                    [Op.like]: "%sound_set_%"
                }
            }, {
                transaction
            });
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
        }
    )
} satisfies Migration;

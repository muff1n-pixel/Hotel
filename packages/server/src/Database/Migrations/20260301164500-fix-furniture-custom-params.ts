import { Op, QueryInterface } from 'sequelize';
import type { Migration } from "sequelize-cli";

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            const furniture: any[] = await queryInterface.select(null, "furnitures", {
                transaction
            });

            for(const furni of furniture) {
                if(JSON.parse(furni.customParams) === null || JSON.parse(furni.customParams)[0] === null) {
                    continue;
                }

                await queryInterface.bulkUpdate("furnitures", {
                    customParams: JSON.stringify(JSON.parse(furni.customParams)?.map((value: any) => value?.toString()))
                }, {
                    id: furni.id
                }, {
                    transaction
                });
            }
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
        }
    )
} satisfies Migration;

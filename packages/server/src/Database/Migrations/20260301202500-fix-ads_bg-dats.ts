import { Op, QueryInterface } from 'sequelize';
import type { Migration } from "sequelize-cli";

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            const userFurnis: any[] = await queryInterface.select(null, "user_furnitures", {
                where: {
                    data: {
                        [Op.like]: '%imageUrl%'
                    }
                },

                transaction
            });

            for(const userFurni of userFurnis) {
                const data = JSON.parse(userFurni.data);

                await queryInterface.bulkUpdate("user_furnitures", {
                    data: JSON.stringify({
                        $type:"UserFurnitureCustomData",

                        background: {
                            $type: "UserFurnitureBackgroundData",
                            imageUrl: data.imageUrl,
                            left: data.position.x,
                            top: data.position.y,
                            index: data.position.z
                        }
                    }),
                },{
                    id: userFurni.id
                });
            }
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
        }
    )
} satisfies Migration;

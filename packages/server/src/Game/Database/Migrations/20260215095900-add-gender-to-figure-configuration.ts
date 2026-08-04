import { QueryInterface, DataTypes, Op } from 'sequelize';
import type { Migration } from "sequelize-cli";


export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            const users: any = await queryInterface.select(null, "users", {
                transaction   
            });

            for(let user of users) {
                const figureConfiguration = JSON.stringify({
                    gender: "male",
                    parts: JSON.parse(user.figureConfiguration)
                });

                await queryInterface.sequelize.query("UPDATE users SET figureConfiguration = :figureConfiguration WHERE id = :id LIMIT 1", {
                    replacements: {
                        id: user.id,
                        figureConfiguration
                    },
                    transaction
                });
            }
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            const users: any = await queryInterface.select(null, "users", {
                transaction   
            });

            for(let user of users) {
                const figureConfiguration = JSON.stringify(JSON.parse(user.figureConfiguration).parts);

                await queryInterface.sequelize.query("UPDATE users SET figureConfiguration = :figureConfiguration WHERE id = :id LIMIT 1", {
                    replacements: {
                        id: user.id,
                        figureConfiguration
                    },
                    transaction
                });
            }
        }
    )
} satisfies Migration;

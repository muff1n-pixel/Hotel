import { QueryInterface, DataTypes, Op } from 'sequelize';
import type { Migration } from "sequelize-cli";

const badges = [
    {
        id: "PX63B",
        name: "Pixel63 Lab Rats",
        description: "You are a true lab rat!",
        image: "pixel63/PX63B.gif"
    },
    {
        id: "PX631",
        image: "pixel63/PX631.gif"
    },
    {
        id: "PX632",
        image: "pixel63/PX632.gif"
    },
    {
        id: "PX633",
        image: "pixel63/PX633.gif"
    },
    {
        id: "PX634",
        image: "pixel63/PX634.gif"
    }
];

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
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
            });
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.bulkDelete("badges", {
                id: {
                    [Op.in]: badges.map((badge: any) => badge.id)
                }
            }, {
                transaction
            });
        }
    )
} satisfies Migration;

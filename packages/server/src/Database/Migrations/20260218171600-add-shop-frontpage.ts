import { randomUUID } from "node:crypto";
import { QueryInterface } from "sequelize";
import type { Migration } from "sequelize-cli";

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            const pageId = randomUUID();

            await queryInterface.insert(null, "shop_pages", {
                id: pageId,
                index: 0,

                category: "frontpage",
                type: "features",

                title: "Frontpage",

                icon: "icon_213.png",
                header: "catalog_frontpage_headline_shop_EN.gif",

                updatedAt: new Date(),
                createdAt: new Date()
            }, {
                transaction
            });

            

            async function getPageId(title: string) {
                const pages = await queryInterface.select(null, "shop_pages", {
                    where: {
                        title
                    },
                    transaction
                });

                return (pages[0] as any).id;
            }

            await queryInterface.bulkInsert("shop_page_features", [
                {
                    type: "vertical",

                    title: "Habbo Club",
                    image: "feature_cata_vert_HC_xmas22.png",

                    index: 0,

                    featuredPageId: await getPageId("Habbo Club")
                },
                {
                    type: "horizontal",

                    title: "Show off your gardening skills!",
                    image: "feature_cata_hort_gardenbundle.png",

                    index: 1,

                    featuredPageId: await getPageId("Gardening")
                },
                {
                    type: "horizontal",

                    title: "Country stuff!",
                    image: "feature_cata_hort_CoastalBundle.png",

                    index: 2,

                    featuredPageId: await getPageId("Country")
                },
                {
                    type: "horizontal",

                    title: "Habbo Club",
                    image: "feature_cata_hort_HCmar.png",

                    index: 3,

                    featuredPageId: await getPageId("Habbo Club")
                }
            ].map((feature) => {
                return {
                    id: randomUUID(),
                    pageId: pageId,

                    updatedAt: new Date(),
                    createdAt: new Date(),

                    ...feature
                }
            }), {
                transaction
            });
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.bulkDelete("shop_page_features", {}, { transaction });

            await queryInterface.bulkDelete("shop_pages", {
                title: "Frontpage",
                category: "frontpage"
            }, {
                transaction
            });
        }
    )
} satisfies Migration;

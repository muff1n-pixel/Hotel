import { QueryInterface, DataTypes, Op, QueryTypes } from 'sequelize';
import type { Migration } from "sequelize-cli";
import { getExistingFurnitureAssets } from '../Development/FurnitureDevelopmentData.js';
import { randomUUID } from 'node:crypto';

const assets = [
    'hygge_c25_airfryer',
    'hygge_c25_armchair',
    'hygge_c25_barstool',
    'hygge_c25_books',
    'hygge_c25_broom',
    'hygge_c25_carpet',
    'hygge_c25_carpetfloor',
    'hygge_c25_cleaningbucket',
    'hygge_c25_cleaningrack',
    'hygge_c25_coffeetable',
    'hygge_c25_counter1',
    'hygge_c25_counter2',
    'hygge_c25_cupboard',
    'hygge_c25_desklamp',
    'hygge_c25_divider',
    'hygge_c25_featherdeco',
    'hygge_c25_floor1',
    'hygge_c25_flowerdeco',
    'hygge_c25_hairdryer',
    'hygge_c25_hangingchair',
    'hygge_c25_kitchensink',
    'hygge_c25_knifeblock',
    'hygge_c25_ladder',
    'hygge_c25_laundrybasket',
    'hygge_c25_microwave',
    'hygge_c25_mirror',
    'hygge_c25_papertowel',
    'hygge_c25_remote',
    'hygge_c25_shower',
    'hygge_c25_sidetable',
    'hygge_c25_soap',
    'hygge_c25_sofa',
    'hygge_c25_sponges',
    'hygge_c25_stove',
    'hygge_c25_toiletpaper',
    'hygge_c25_toiletseat',
    'hygge_c25_toiletsink',
    'hygge_c25_towels',
    'hygge_c25_tumbler',
    'hygge_c25_tv',
    'hygge_c25_waffleiron',
    'hygge_c25_wall1',
    'hygge_c25_wall2',
    'hygge_c25_wallpaper1',
    'hygge_c25_wallpaper2',
    'hygge_c25_washer',
    'hygge_c25_washyduck',
    'hygge_c25_window1',
    'hygge_c25_window2'
].map((type) => {
    return {
        type,
        color: null,

        credits: 3,
        duckets: null,
        diamonds: null
    };
});

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            const furnitureDatas = await getExistingFurnitureAssets((assetName) => assets.some((asset) => asset.type === assetName));

            await queryInterface.bulkInsert("furnitures", furnitureDatas.flatMap((furnitures) => furnitures).map((furniture) => {
                return {
                    id: randomUUID(),
                    type: furniture.type,
        
                    name: furniture.name,
                    description: furniture.description,
        
                    flags: JSON.stringify(furniture.flags),
        
                    color: furniture.color ?? null,
                    placement: furniture.placement,
                    dimensions: JSON.stringify(furniture.dimensions),
        
                    category: furniture.category,
                    interactionType: furniture.interactionType,
        
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
            }), {
                type: QueryTypes.INSERT,
                transaction
            });

            const rootShopPage: any = (await queryInterface.select(null, "shop_pages", {
                where: {
                    title: "Public Rooms"
                },
                transaction
            }))[0];

            const shopPageId = randomUUID();

            await queryInterface.insert(null, "shop_pages", {
                id: shopPageId,
                parentId: rootShopPage.id,
                index: 0,

                type: "default",

                category: "furniture",
                title: "Summer Hygge",
                description: null,

                icon: "icon_346.png",
                header: null,
                teaser: null,
        
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                transaction
            });

            const furniture = await queryInterface.select(null, "furnitures", {
                where: {
                    type: {
                        [Op.in]: assets.map((asset) => asset.type)
                    }
                },
                transaction
            });

            await queryInterface.bulkInsert("shop_page_furnitures", furniture.map((furniture: any) => {
                const furnitureShopData = assets.find((childFurniture: any) => childFurniture.type === furniture.type && ((furniture.color)?(childFurniture.color === furniture.color):(true)));

                return {
                    id: randomUUID(),
                    furnitureId: furniture.id,
                    shopPageId: shopPageId,

                    credits: furnitureShopData!.credits,
                    duckets: furnitureShopData!.duckets,
                    diamonds: furnitureShopData!.diamonds,
        
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
            }), {
                transaction
            })
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            const furniture = await queryInterface.select(null, "furnitures", {
                where: {
                    type: {
                        [Op.in]: assets.map((asset) => asset.type)
                    }
                },
                transaction
            });

            await queryInterface.bulkDelete("shop_page_furnitures", {
              furnitureId: {
                [Op.in]: furniture.map((furniture: any) => furniture.id)
              }
            }, {
                transaction
            });

            await queryInterface.bulkDelete("furnitures", {
              id: {
                [Op.in]: furniture.map((furniture: any) => furniture.id)
              }
            }, {
                transaction
            });

            await queryInterface.bulkDelete("shop_pages", {
                title: "Summer Hygge"
            }, {
                transaction
            });
        }
    )
} satisfies Migration;

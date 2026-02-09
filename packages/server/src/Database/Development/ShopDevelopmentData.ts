import { randomUUID } from "node:crypto";
import { ShopPageModel } from "../Models/Shop/ShopPageModel.js";
import { getFloorIds, getWallIds } from "./FurnitureDevelopmentData.js";
import { FurnitureModel } from "../Models/Furniture/FurnitureModel.js";
import { ShopPageFurnitureModel } from "../Models/Shop/ShopPageFurnitureModel.js";
import { Op } from "@sequelize/core";
import { sequelize } from "../Database.js";

const defaultShopPages: any = [
    {
        type: "none",

        title: "By type",

        icon: "icon_72.png",
        header: "catalog_frontpage_headline_shop_EN.gif",

        pages: [
            {
                title: "Jukebox",
                description: "Let's get loud! Place a Jukebox in your room, add some disks from the 'Habbo Hotel Hits' list below and you're ready to have a dance party!",

                icon: "icon_16.png",
                header: "music_header.gif",
                teaser: "music_teaser.gif",

                furnitures: [
                    { type: "jukebox_big", credits: 5 },
                    { type: "jukebox", color: 1, credits: 1 }
                ]
            },
            {
                title: "Accessories",
                description: "However you place your essential furniture, it's the finishing touch that counts!",

                icon: "icon_11.png",
                header: "accessories_header.gif",
                teaser: "accessories_teaser.gif",

                furnitures: [
                    { type: "post_it", credits: 3 },
                    { type: "note_tag", duckets: 50 },
                    { type: "drinks", duckets: 150 },
                    { type: "pizza", duckets: 150 },
                    { type: "tv_flat", credits: 1, duckets: 150 },
                    { type: "trading_table", credits: 10 },
                    { type: "tv_luxus", credits: 6 },
                    { type: "wood_tv", credits: 4 },
                    { type: "red_tv", credits: 3 },
                    { type: "computer_laptop", credits: 2 },
                    { type: "computer_old", credits: 3 },
                    { type: "computer_flatscreen", credits: 3 },
                    { type: "clrack", credits: 2 },
                    { type: "noticeboard", credits: 2 },
                    { type: "fireworks_07", credits: 12 },
                    { type: "fireworks_06", credits: 7 },
                    { type: "fireworks_05", credits: 7 },
                    { type: "fireworks_04", credits: 5 },
                    { type: "fireworks_03", credits: 5 },
                    { type: "fireworks_02", credits: 5 },
                    { type: "fireworks_01", credits: 5 },
                    { type: "stories_oldmusic_mike", credits: 4 },
                    { type: "stories_oldmusic_neon", credits: 5 },
                    { type: "stories_oldmusic_guitarcase", credits: 8 },
                    { type: "party_djtable", credits: 3 },
                    { type: "studio_guitar", credits: 7 },
                    { type: "cine_vipsign", credits: 3 }
                ]
            },
            {
                title: "Dimmers",
                description: "Check out the Mood Lights. Use these items to dim the light in your rooms. Try out different light settings with different wallpapers to see what you get. Talk about lighting with style!",

                icon: "icon_51.png",
                header: "dimmers_header.gif",
                teaser: "dimmers_teaser.gif",

                furnitures: [
                    { type: "dimmer_buttn", credits: 3, duckets: 250 },
                    { type: "dimmer_swtch", credits: 9, diamonds: 10 },
                    { type: "roomdimmer", credits: 12 },
                    { type: "dimmer_fuse2", credits: 10 },
                    { type: "dimmer_fuse6", credits: 10 },
                ]
            },
            {
                title: "Floor patterns",
                description: "Use our virtual room preview to test out the design and colour of floor pattern you like before buying.",

                icon: "icon_225.png",

                furnitures: getFloorIds().map((floorId: number) => {
                    return {
                        type: "floor",
                        color: floorId,
                        credits: 2
                    };
                })
            },
            {
                title: "Wallpapers",
                description: "Use our virtual room preview to test out the design and colour of wallpaper you like before buying.",

                icon: "icon_286.png",
                teaser: "catalog_spaces_wallpaper.gif",

                furnitures: getWallIds().map((wallId: number) => {
                    return {
                        type: "wallpaper",
                        color: wallId,
                        credits: 2
                    };
                })
            }
        ]
    },
    {
        type: "none",

        title: "By design",

        icon: "icon_273.png",
        header: "catalog_frontpage_headline_shop_EN.gif",

        pages: [
            {
                title: "Country",
                description: "There's nothing better than to pack your picnic basket and find a nice spot outdoors to hang out, play and walk on grass barefoot.",
                
                icon: "icon_21.png",
                header: "country_header.gif",
                teaser: "country_teaser.gif",

                furnitures: [
                    { type: "country_corner", duckets: 75 },
                    { type: "country_log", duckets: 150 },
                    { type: "env_bushes_gate", duckets: 150 },
                    { type: "country_ditch", credits: 1, duckets: 150 },
                    { type: "country_gate", credits: 1, duckets: 150 },
                    { type: "picnic_blanket", credits: 1, duckets: 150 },
                    { type: "picnic_blanket_blu", credits: 1, duckets: 150 },
                    { type: "picnic_blanket_yel", credits: 1, duckets: 150 },
                    { type: "country_wheat", credits: 1, duckets: 225 },
                    { type: "country_fp", credits: 2, diamonds: 10 },
                    { type: "country_trctr", credits: 13, diamonds: 20 },
                    { type: "country_well", credits: 5 },
                    { type: "country_soil", credits: 3 },
                    { type: "country_fnc3", credits: 2 },
                    { type: "country_fnc2", credits: 3 },
                    { type: "country_fnc1", credits: 3 },
                    { type: "country_rbw", credits: 5 },
                    { type: "country_rain", credits: 5 },
                    { type: "country_grass", credits: 4 },
                    { type: "country_forestwall", credits: 4 },
                    { type: "country_wall", credits: 4 },
                    { type: "country_scarecrow", credits: 3 },
                    { type: "country_patio", credits: 2 },
                    { type: "country_lantern", credits: 3 },
                    { type: "country_stage", credits: 3 },
                    { type: "env_telep", credits: 6 },
                    { type: "picnic_chair", credits: 3 },
                    { type: "picnic_basket", credits: 3 },
                    { type: "picnic_pillow", credits: 2 },
                    { type: "picnic_pillow_blu", credits: 2 },
                    { type: "picnic_pillow_yel", credits: 2 },
                    { type: "picnic_food1", credits: 1 },
                    { type: "picnic_food2", credits: 1 },
                    { type: "picnic_food3", credits: 1 },
                    { type: "picnic_3brds", credits: 4 },
                    { type: "picnic_tele", credits: 6 },
                    { type: "picnic_wfall", credits: 10 },
                    { type: "env_bushes", credits: 2 },
                    { type: "env_tree4", credits: 5 },
                    { type: "env_tree1", credits: 3 },
                    { type: "env_tree2", credits: 3 },
                    { type: "env_tree3", credits: 3 },
                    { type: "plant_maze", credits: 5 },
                    { type: "plant_mazegate", credits: 6 },
                ]
            },

            {
                title: "Gardening",
                description: "Plant your crops and watch them grow to beautiful plants!",
                
                icon: "icon_157.png",
                header: "garden_header.gif",
                teaser: "garden_catalog_teaser.gif",

                furnitures: [
                    { type: "stone_flowerbed", duckets: 150 },
                    { type: "garden_c15_toolshed", credits: 2, duckets: 225 },
                    { type: "garden_c15_shroomchr", credits: 4 },
                    { type: "gh_div_wall", credits: 4 },
                    { type: "gh_div_cor", credits: 3 },
                    { type: "watering_can", credits: 2 },
                    { type: "gardening_box", credits: 2 },
                    { type: "gardenshed_wall", credits: 4 },
                    { type: "stone_wall", credits: 3 },
                    { type: "stone_platform", credits: 3 },
                    { type: "stone_stairs", credits: 2 }
                ]
            },
        ]
    }
];

export async function recreateShopPages() {
    for(let root of defaultShopPages) {
        const page = await ShopPageModel.create({
            id: randomUUID(),
            index: defaultShopPages.indexOf(root),

            type: root.type ?? "default",

            category: "furniture",
            title: root.title,
            description: root.description,

            icon: root.icon,
            header: root.header,
            teaser: root.teaser,
        });

        for(let child of root.pages) {
            const furnitureData = await FurnitureModel.findAll({
                where: {
                    [Op.or]: child.furnitures.map((furniture: any) => {
                        return {
                            type: furniture.type,
                            color: furniture.color ?? null
                        };
                    })
                }
            });

            const childPage = await ShopPageModel.create({
                id: randomUUID(),
                index: root.pages.indexOf(child),

                type: child.type ?? "default",

                category: "furniture",
                title: child.title,
                description: child.description,

                icon: child.icon,
                header: child.header,
                teaser: child.teaser,

                parentId: page.id
            });

            await ShopPageFurnitureModel.bulkCreate(furnitureData.map((furniture) => {
                const furnitureShopData = child.furnitures.find((childFurniture: any) => childFurniture.type === furniture.type && ((furniture.color)?(childFurniture.color === furniture.color):(true)));

                return {
                    id: randomUUID(),
                    furnitureId: furniture.id,
                    shopPageId: childPage.id,

                    credits: furnitureShopData.credits,
                    duckets: furnitureShopData.duckets,
                    diamonds: furnitureShopData.diamonds
                };
            }));
        }
    }
}
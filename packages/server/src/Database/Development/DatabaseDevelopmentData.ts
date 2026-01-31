import { RoomFurnitureModel } from "../Models/Rooms/RoomFurnitureModel.js";
import { RoomModel } from "../Models/Rooms/RoomModel.js";
import { randomUUID } from "crypto";
import { ShopPageModel } from "../Models/Shop/ShopPageModel.js";
import { ShopPageFurnitureModel } from "../Models/Shop/ShopPageFurnitureModel.js";
import { FurnitureModel } from "../Models/Furniture/FurnitureModel.js";
import { getExistingFurnitureAssets, getFloorIds, getWallIds } from "./FurnitureDevelopmentData.js";
import { UserModel } from "../Models/Users/UserModel.js";
import { UserFurnitureModel } from "../Models/Users/Furniture/UserFurnitureModel.js";
import { RoomMapModel } from "../Models/Rooms/Maps/RoomMapModel.js";
import { Op } from "sequelize";
import { RoomChatStyleModel } from "../Models/Rooms/Chat/Styles/RoomChatStyleModel.js";

const defaultShopPages: any = [
    {
        title: "By type",
        description: "Lalallala",

        icon: "icon_72.png",
        header: "catalog_frontpage_headline_shop_EN.gif",

        pages: [
            {
                title: "Jukebox",
                furnitures: [
                    { type: "jukebox_big", credits: 5 },
                    { type: "jukebox", color: 1, credits: 1 }
                ]
            },
            {
                title: "Accessories",
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
                title: "Wallpapers",
                furnitures: getWallIds().map((wallId: number) => {
                    return {
                        type: "wallpaper",
                        color: wallId,
                        credits: 2
                    };
                })
            },

            {
                title: "Floors",
                furnitures: getFloorIds().map((floorId: number) => {
                    return {
                        type: "floor",
                        color: floorId,
                        credits: 2
                    };
                })
            }
        ]
    },
    {
        title: "By design",
        description: "Lalallala",

        icon: "icon_273.png",
        header: "catalog_frontpage_headline_shop_EN.gif",

        pages: [
            {
                title: "Country",
                description: "There's nothing better than to pack your picnic basket and find a nice spot outdoors to hang out, play and walk on grass barefoot.",
                
                icon: "icon_21.png",
                header: "catalog_frontpage_headline_shop_EN.gif",

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
        ]
    }
];

export async function initializeDevelopmentData() {
    await RoomChatStyleModel.bulkCreate(["normal_red", "normal_purple", "console", "parrot", "gothicrose", "normal_dark_yellow", "radio", "notification", "piglet", "zombie_hand", "generic", "normal", "bats", "goat", "fortune_teller", "steampunk_pipe", "storm", "normal_blue", "ambassador", "firingmylazer", "bot_frank_large", "skeleton", "snowstorm_red", "sausagedog", "hearts", "dragon", "bot_guide", "pirate", "skelestock"].map((id) => {
        return { id };
    }));

    await RoomMapModel.bulkCreate([
        {
            id: 'model_4',
            door: {
                row: 12,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxxxx', 'xXXXXXXXX9999999999999x', 'xXXXXXXXX9999999999999x', 'xXXXXXXXX9999999999999x', 'xXXXXXXXX9999999999999x', 'x00000000XXXXXXX999999x', 'x00000000XXXXXXX999999x', 'x00000000XXXXXXX999999x', 'x00000000XXXXXXX999999x', 'x000000000000000999999x', 'x000000000000000999999x', 'x000000000000000999999x', '0000000000000000999999x', 'x000000000000000XXXXXXx', 'x000000000000000XXXXXXx', 'x000000000000000XXXXXXx', 'x000000000000000XXXXXXx', 'x000000000000000XXXXXXx', 'x000000000000000XXXXXXx', 'xxxxxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_3',
            door: {
                row: 10,
                column: 0,
                direction: 2,
            },
            grid: ['XXXXXXXXXXXXXXXXX', 'XXX0000000000000X', 'XXX0000000000000X', 'XXX0000000000000X', 'XXX0000000000000X', 'XXX0000000000000X', 'XXX0000000000000X', 'X000000000000000X', 'X000000000000000X', 'X000000000000000X', '0000000000000000X', 'X000000000000000X', 'X000000000000000X', 'X000000000000000X', 'XXXXXXXXXXXXXXXXX']
        },
        {
            id: 'model_y',
            door: {
                row: 3,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'x00000000xx0000000000xx0000x', 'x00000000xx0000000000xx0000x', '000000000xx0000000000xx0000x', 'x00000000xx0000000000xx0000x', 'x00000000xx0000xx0000xx0000x', 'x00000000xx0000xx0000xx0000x', 'x00000000xx0000xx0000000000x', 'x00000000xx0000xx0000000000x', 'xxxxx0000xx0000xx0000000000x', 'xxxxx0000xx0000xx0000000000x', 'xxxxx0000xx0000xxxxxxxxxxxxx', 'xxxxx0000xx0000xxxxxxxxxxxxx', 'x00000000xx0000000000000000x', 'x00000000xx0000000000000000x', 'x00000000xx0000000000000000x', 'x00000000xx0000000000000000x', 'x0000xxxxxxxxxxxxxxxxxx0000x', 'x0000xxxxxxxxxxxxxxxxxx0000x', 'x00000000000000000000000000x', 'x00000000000000000000000000x', 'x00000000000000000000000000x', 'x00000000000000000000000000x', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_u',
            door: {
                row: 17,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxxxxx', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', '11111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'xxxxxxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_z',
            door: {
                row: 9,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxx00000000000000000000', 'xxxxxxxxxxx00000000000000000000', 'xxxxxxxxxxx00000000000000000000', 'x00000000xx00000000000000000000', 'x00000000xx00000000000000000000', 'x00000000xx00000000000000000000', 'x00000000xx00000000000000000000', 'x00000000xx00000000000000000000', '000000000xx00000000000000000000', 'x00000000xx00000000000000000000', 'x00000000xx00000000000000000000', 'x00000000xx00000000000000000000', 'x00000000xx00000000000000000000', 'x00000000xx00000000000000000000', 'x00000000xx00000000000000000000', 'xxxxxxxxxxx00000000000000000000', 'xxxxxxxxxxx00000000000000000000', 'xxxxxxxxxxx00000000000000000000', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_w',
            door: {
                row: 3,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxxxxxxxx', 'x2222xx1111111111xx11111111', 'x2222xx1111111111xx11111111', '222222111111111111111111111', 'x22222111111111111111111111', 'x22222111111111111111111111', 'x22222111111111111111111111', 'x2222xx1111111111xx11111111', 'x2222xx1111111111xx11111111', 'x2222xx1111111111xxxx1111xx', 'x2222xx1111111111xxxx0000xx', 'xxxxxxx1111111111xx00000000', 'xxxxxxx1111111111xx00000000', 'x22222111111111111000000000', 'x22222111111111111000000000', 'x22222111111111111000000000', 'x22222111111111111000000000', 'x2222xx1111111111xx00000000', 'x2222xx1111111111xx00000000', 'x2222xxxx1111xxxxxxxxxxxxxx', 'x2222xxxx0000xxxxxxxxxxxxxx', 'x2222x0000000000xxxxxxxxxxx', 'x2222x0000000000xxxxxxxxxxx', 'x2222x0000000000xxxxxxxxxxx', 'x2222x0000000000xxxxxxxxxxx', 'x2222x0000000000xxxxxxxxxxx', 'x2222x0000000000xxxxxxxxxxx']
        },
        {
            id: 'model_x',
            door: {
                row: 12,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxx', 'x000000000000000000x', 'x000000000000000000x', 'x000000000000000000x', 'x000000000000000000x', 'x000000000000000000x', 'x000000000000000000x', 'xxx00xxx0000xxx00xxx', 'x000000x0000x000000x', 'x000000x0000x000000x', 'x000000x0000x000000x', 'x000000x0000x000000x', '0000000x0000x000000x', 'x000000x0000x000000x', 'x000000x0000x000000x', 'x000000x0000x000000x', 'x000000x0000x000000x', 'x000000x0000x000000x', 'x000000xxxxxx000000x', 'x000000000000000000x', 'x000000000000000000x', 'x000000000000000000x', 'x000000000000000000x', 'x000000000000000000x', 'x000000000000000000x', 'xxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_0',
            door: {
                row: 4,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'x00000000xx00000000xx00000000xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'x00000000xx00000000xx00000000xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'x00000000xx00000000xx00000000xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx0000', '000000000xx00000000xx00000000xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx0000', 'x00000000xx00000000xx00000000xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx0000', 'x00000000xx00000000xx00000000xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx0000', 'x00000000xx00000000xx00000000xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'x00000000xx00000000xx00000000xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_v',
            door: {
                row: 3,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxx', 'x222221111111111111x', 'x222221111111111111x', '2222221111111111111x', 'x222221111111111111x', 'x222221111111111111x', 'x222221111111111111x', 'xxxxxxxx1111xxxxxxxx', 'xxxxxxxx0000xxxxxxxx', 'x000000x0000x000000x', 'x000000x0000x000000x', 'x00000000000x000000x', 'x00000000000x000000x', 'x000000000000000000x', 'x000000000000000000x', 'xxxxxxxx00000000000x', 'x000000x00000000000x', 'x000000x0000xxxxxxxx', 'x00000000000x000000x', 'x00000000000x000000x', 'x00000000000x000000x', 'x00000000000x000000x', 'xxxxxxxx0000x000000x', 'x000000x0000x000000x', 'x000000x0000x000000x', 'x000000000000000000x', 'x000000000000000000x', 'x000000000000000000x', 'x000000000000000000x', 'xxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_t',
            door: {
                row: 3,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'x222222222222222222222222222x', 'x222222222222222222222222222x', '2222222222222222222222222222x', 'x222222222222222222222222222x', 'x2222xxxxxx222222xxxxxxx2222x', 'x2222xxxxxx111111xxxxxxx2222x', 'x2222xx111111111111111xx2222x', 'x2222xx111111111111111xx2222x', 'x2222xx11xxx1111xxxx11xx2222x', 'x2222xx11xxx0000xxxx11xx2222x', 'x22222111x00000000xx11xx2222x', 'x22222111x00000000xx11xx2222x', 'x22222111x00000000xx11xx2222x', 'x22222111x00000000xx11xx2222x', 'x22222111x00000000xx11xx2222x', 'x22222111x00000000xx11xx2222x', 'x2222xx11xxxxxxxxxxx11xx2222x', 'x2222xx11xxxxxxxxxxx11xx2222x', 'x2222xx111111111111111xx2222x', 'x2222xx111111111111111xx2222x', 'x2222xxxxxxxxxxxxxxxxxxx2222x', 'x2222xxxxxxxxxxxxxxxxxxx2222x', 'x222222222222222222222222222x', 'x222222222222222222222222222x', 'x222222222222222222222222222x', 'x222222222222222222222222222x', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_h',
            door: {
                row: 4,
                column: 4,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxx111111x', 'xxxxx111111x', 'xxxx1111111x', 'xxxxx111111x', 'xxxxx111111x', 'xxxxx000000x', 'xxxxx000000x', 'xxx00000000x', 'xxx00000000x', 'xxx00000000x', 'xxx00000000x', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx']
        },
        {
            id: 'model_p',
            door: {
                row: 23,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxx', 'xxxxxxx222222222222', 'xxxxxxx222222222222', 'xxxxxxx222222222222', 'xxxxxxx222222222222', 'xxxxxxx222222222222', 'xxxxxxx222222222222', 'xxxxxxx22222222xxxx', 'xxxxxxx11111111xxxx', 'x222221111111111111', 'x222221111111111111', 'x222221111111111111', 'x222221111111111111', 'x222221111111111111', 'x222221111111111111', 'x222221111111111111', 'x222221111111111111', 'x2222xx11111111xxxx', 'x2222xx00000000xxxx', 'x2222xx000000000000', 'x2222xx000000000000', 'x2222xx000000000000', 'x2222xx000000000000', '22222xx000000000000', 'x2222xx000000000000', 'xxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_r',
            door: {
                row: 4,
                column: 10,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxx33333333333333', 'xxxxxxxxxxx33333333333333', 'xxxxxxxxxxx33333333333333', 'xxxxxxxxxx333333333333333', 'xxxxxxxxxxx33333333333333', 'xxxxxxxxxxx33333333333333', 'xxxxxxx333333333333333333', 'xxxxxxx333333333333333333', 'xxxxxxx333333333333333333', 'xxxxxxx333333333333333333', 'xxxxxxx333333333333333333', 'xxxxxxx333333333333333333', 'x4444433333xxxxxxxxxxxxxx', 'x4444433333xxxxxxxxxxxxxx', 'x44444333333222xx000000xx', 'x44444333333222xx000000xx', 'xxx44xxxxxxxx22xx000000xx', 'xxx33xxxxxxxx11xx000000xx', 'xxx33322222211110000000xx', 'xxx33322222211110000000xx', 'xxxxxxxxxxxxxxxxx000000xx', 'xxxxxxxxxxxxxxxxx000000xx', 'xxxxxxxxxxxxxxxxx000000xx', 'xxxxxxxxxxxxxxxxx000000xx', 'xxxxxxxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_q',
            door: {
                row: 4,
                column: 10,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxx22222222', 'xxxxxxxxxxx22222222', 'xxxxxxxxxxx22222222', 'xxxxxxxxxx222222222', 'xxxxxxxxxxx22222222', 'xxxxxxxxxxx22222222', 'x222222222222222222', 'x222222222222222222', 'x222222222222222222', 'x222222222222222222', 'x222222222222222222', 'x222222222222222222', 'x2222xxxxxxxxxxxxxx', 'x2222xxxxxxxxxxxxxx', 'x2222211111xx000000', 'x222221111110000000', 'x222221111110000000', 'x2222211111xx000000', 'xx22xxx1111xxxxxxxx', 'xx11xxx1111xxxxxxxx', 'x1111xx1111xx000000', 'x1111xx111110000000', 'x1111xx111110000000', 'x1111xx1111xx000000', 'xxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_o',
            door: {
                row: 18,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxx11111111xxxx', 'xxxxxxxxxxxxx11111111xxxx', 'xxxxxxxxxxxxx11111111xxxx', 'xxxxxxxxxxxxx11111111xxxx', 'xxxxxxxxxxxxx11111111xxxx', 'xxxxxxxxxxxxx11111111xxxx', 'xxxxxxxxxxxxx11111111xxxx', 'xxxxxxxxxxxxx00000000xxxx', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'x111111100000000000000000', 'x111111100000000000000000', 'x111111100000000000000000', '1111111100000000000000000', 'x111111100000000000000000', 'x111111100000000000000000', 'x111111100000000000000000', 'x111111100000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_n',
            door: {
                row: 16,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxx', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x000000xxxxxxxx000000', 'x000000x000000x000000', 'x000000x000000x000000', 'x000000x000000x000000', 'x000000x000000x000000', 'x000000x000000x000000', 'x000000x000000x000000', 'x000000xxxxxxxx000000', 'x00000000000000000000', '000000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'xxxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_g',
            door: {
                row: 7,
                column: 1,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxx00000', 'xxxxxxx00000', 'xxxxxxx00000', 'xx1111000000', 'xx1111000000', 'x11111000000', 'xx1111000000', 'xx1111000000', 'xxxxxxx00000', 'xxxxxxx00000', 'xxxxxxx00000', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx']
        },
        {
            id: 'model_l',
            door: {
                row: 16,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxx', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000xxxx00000000', 'x00000000xxxx00000000', 'x00000000xxxx00000000', 'x00000000xxxx00000000', 'x00000000xxxx00000000', 'x00000000xxxx00000000', 'x00000000xxxx00000000', '000000000xxxx00000000', 'x00000000xxxx00000000', 'x00000000xxxx00000000', 'x00000000xxxx00000000', 'x00000000xxxx00000000', 'xxxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_m',
            door: {
                row: 15,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'x0000000000000000000000000000', 'x0000000000000000000000000000', 'x0000000000000000000000000000', 'x0000000000000000000000000000', '00000000000000000000000000000', 'x0000000000000000000000000000', 'x0000000000000000000000000000', 'x0000000000000000000000000000', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_k',
            door: {
                row: 13,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxx00000000', 'xxxxxxxxxxxxxxxxx00000000', 'xxxxxxxxxxxxxxxxx00000000', 'xxxxxxxxxxxxxxxxx00000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'x000000000000000000000000', 'x000000000000000000000000', 'x000000000000000000000000', 'x000000000000000000000000', '0000000000000000000000000', 'x000000000000000000000000', 'x000000000000000000000000', 'x000000000000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_j',
            door: {
                row: 10,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxx0000000000', 'xxxxxxxxxxx0000000000', 'xxxxxxxxxxx0000000000', 'xxxxxxxxxxx0000000000', 'xxxxxxxxxxx0000000000', 'xxxxxxxxxxx0000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', '000000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x0000000000xxxxxxxxxx', 'x0000000000xxxxxxxxxx', 'x0000000000xxxxxxxxxx', 'x0000000000xxxxxxxxxx', 'x0000000000xxxxxxxxxx', 'x0000000000xxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_i',
            door: {
                row: 10,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxx', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', '00000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'xxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_e',
            door: {
                row: 5,
                column: 1,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xx0000000000', 'xx0000000000', 'x00000000000', 'xx0000000000', 'xx0000000000', 'xx0000000000', 'xx0000000000', 'xx0000000000', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx']
        },
        {
            id: 'model_f',
            door: {
                row: 5,
                column: 2,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxx', 'xxxxxxx0000x', 'xxxxxxx0000x', 'xxx00000000x', 'xxx00000000x', 'xx000000000x', 'xxx00000000x', 'x0000000000x', 'x0000000000x', 'x0000000000x', 'x0000000000x', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx']
        },
        {
            id: 'model_a',
            door: {
                row: 5,
                column: 3,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxx', 'xxxx00000000', 'xxxx00000000', 'xxxx00000000', 'xxxx00000000', 'xxx000000000', 'xxxx00000000', 'xxxx00000000', 'xxxx00000000', 'xxxx00000000', 'xxxx00000000', 'xxxx00000000', 'xxxx00000000', 'xxxx00000000', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx']
        },
        {
            id: 'model_b',
            door: {
                row: 5,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxx', 'xxxxx0000000', 'xxxxx0000000', 'xxxxx0000000', 'xxxxx0000000', '000000000000', 'x00000000000', 'x00000000000', 'x00000000000', 'x00000000000', 'x00000000000', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx']
        },
        {
            id: 'model_c',
            door: {
                row: 7,
                column: 4,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxx000000x', 'xxxxx000000x', 'xxxx0000000x', 'xxxxx000000x', 'xxxxx000000x', 'xxxxx000000x', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx']
        },
        {
            id: 'model_d',
            door: {
                row: 7,
                column: 4,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxx', 'xxxxx000000x', 'xxxxx000000x', 'xxxxx000000x', 'xxxxx000000x', 'xxxxx000000x', 'xxxxx000000x', 'xxxx0000000x', 'xxxxx000000x', 'xxxxx000000x', 'xxxxx000000x', 'xxxxx000000x', 'xxxxx000000x', 'xxxxx000000x', 'xxxxx000000x', 'xxxxxxxxxxxx']
        },
        {
            id: 'model_1',
            door: {
                row: 10,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xeeeeeeeeeeeeeeeedcba9888888888888', 'xeeeeeeeeeeeeeeeexxxxxx88888888888', 'xeeeeeeeeeeeeeeeexxxxxx88888888888', 'xeeeeeeeeeeeeeeeexxxxxx88888888888', 'xeeeeeeeeeeeeeeeexxxxxx88888888888', 'xdxxxxxxxxxxxxxxxxxxxxx88888888888', 'xcxxxxxxxxxxxxxxxxxxxxx88888888888', 'xbxxxxxxxxxxxxxxxxxxxxx88888888888', 'xaxxxxxxxxxxxxxxxxxxxxx88888888888', 'aaaaaaaaaaaaaaaaaxxxxxxxxxxxxxxxxx', 'xaaaaaaaaaaaaaaaaxxxxxxxxxxxxxxxxx', 'xaaaaaaaaaaaaaaaaxxxxxxxxxxxxxxxxx', 'xaaaaaaaaaaaaaaaaxxxx6666666666666', 'xaaaaaaaaaaaaaaaaxxxx6666666666666', 'xaaaaaaaaaaaaaaaaxxxx6666666666666', 'xaaaaaaaaaaaaaaaaxxxx6666666666666', 'xaaaaaaaaaaaaaaaaxxxx6666666666666', 'xaaaaaaaaaaaaaaaa98766666666666666', 'xaaaaaaaaaaaaaaaaxxxxxxxxxxxx5xxxx', 'xaaaaaaaaaaaaaaaaxxxxxxxxxxxx4xxxx', 'xaaaaaaaaaaaaaaaaxxxxxxxxxxxx3xxxx', 'xaaaaaaaaaaaaaaaaxxx3333333333xxxx', 'xaaaaaaaaaaaaaaaaxxx3333333333xxxx', 'xaaaaaaaaaaaaaaaaxxx3333333333xxxx', 'xaaaaaaaaaaaaaaaaxxx3333333333xxxx', 'xaaaaaaaaaaaaaaaaxxx3333333333xxxx', 'xaaaaaaaaaaaaaaaaxxx3333333333xxxx', 'xaaaaaaaaaaaaaaaaxxx3333333333xxxx', 'xaaaaaaaaaaaaaaaaxxx3333333333xxxx', 'xaaaaaaaaaaaaaaaaxxx3333333333xxxx', 'xaaaaaaaaaaaaaaaaxxx3333333333xxxx', 'xxxxxxxxxxxxxxxx9xxx3333333333xxxx', 'xxxxxxxxxxxxxxxx8xxx3333333333xxxx', 'xxxxxxxxxxxxxxxx7xxx3333333333xxxx', 'xxx777777777xxxx6xxx3333333333xxxx', 'xxx777777777xxxx5xxxxxxxxxxxxxxxxx', 'xxx777777777xxxx4xxxxxxxxxxxxxxxxx', 'xxx777777777xxxx3xxxxxxxxxxxxxxxxx', 'xxx777777777xxxx2xxxxxxxxxxxxxxxxx', 'xfffffffffxxxxxx1xxxxxxxxxxxxxxxxx', 'xfffffffffxxxxxx111111111111111111', 'xfffffffffxxxxxx111111111111111111', 'xfffffffffxxxxxx111111111111111111', 'xfffffffffxxxxxx111111111111111111', 'xfffffffffxxxxxx111111111111111111', 'xfffffffffxxxxxx111111111111111111', 'xxxxxxxxxxxxxxxx111111111111111111', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_2',
            door: {
                row: 15,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xjjjjjjjjjjjjjx0000xxxxxxxxxx', 'xjjjjjjjjjjjjjx0000xxxxxxxxxx', 'xjjjjjjjjjjjjjx0000xxxxxxxxxx', 'xjjjjjjjjjjjjjx0000xxxxxxxxxx', 'xjjjjjjjjjjjjjx0000xxxxxxxxxx', 'xjjjjjjjjjjjjjx0000xxxxxxxxxx', 'xjjjjjjjjjjjjjx0000xxxxxxxxxx', 'xjjjjjjjjjjjjjx0000xxxxxxxxxx', 'xxxxxxxxxxxxiix0000xxxxxxxxxx', 'xxxxxxxxxxxxhhx0000xxxxxxxxxx', 'xxxxxxxxxxxxggx0000xxxxxxxxxx', 'xxxxxxxxxxxxffx0000xxxxxxxxxx', 'xxxxxxxxxxxxeex0000xxxxxxxxxx', 'xeeeeeeeeeeeeex0000xxxxxxxxxx', 'eeeeeeeeeeeeeex0000xxxxxxxxxx', 'xeeeeeeeeeeeeex0000xxxxxxxxxx', 'xeeeeeeeeeeeeex0000xxxxxxxxxx', 'xeeeeeeeeeeeeex0000xxxxxxxxxx', 'xeeeeeeeeeeeeex0000xxxxxxxxxx', 'xeeeeeeeeeeeeex0000xxxxxxxxxx', 'xeeeeeeeeeeeeex0000xxxxxxxxxx', 'xeeeeeeeeeeeeex0000xxxxxxxxxx', 'xeeeeeeeeeeeeex0000xxxxxxxxxx', 'xxxxxxxxxxxxddx00000000000000', 'xxxxxxxxxxxxccx00000000000000', 'xxxxxxxxxxxxbbx00000000000000', 'xxxxxxxxxxxxaax00000000000000', 'xaaaaaaaaaaaaax00000000000000', 'xaaaaaaaaaaaaax00000000000000', 'xaaaaaaaaaaaaax00000000000000', 'xaaaaaaaaaaaaax00000000000000', 'xaaaaaaaaaaaaax00000000000000', 'xaaaaaaaaaaaaax00000000000000', 'xaaaaaaaaaaaaax00000000000000', 'xaaaaaaaaaaaaax00000000000000', 'xaaaaaaaaaaaaax00000000000000', 'xaaaaaaaaaaaaax00000000000000', 'xxxxxxxxxxxx99x0000xxxxxxxxxx', 'xxxxxxxxxxxx88x0000xxxxxxxxxx', 'xxxxxxxxxxxx77x0000xxxxxxxxxx', 'xxxxxxxxxxxx66x0000xxxxxxxxxx', 'xxxxxxxxxxxx55x0000xxxxxxxxxx', 'xxxxxxxxxxxx44x0000xxxxxxxxxx', 'x4444444444444x0000xxxxxxxxxx', 'x4444444444444x0000xxxxxxxxxx', 'x4444444444444x0000xxxxxxxxxx', 'x4444444444444x0000xxxxxxxxxx', 'x4444444444444x0000xxxxxxxxxx', 'x4444444444444x0000xxxxxxxxxx', 'x4444444444444x0000xxxxxxxxxx', 'x4444444444444x0000xxxxxxxxxx', 'x4444444444444x0000xxxxxxxxxx', 'x4444444444444x0000xxxxxxxxxx', 'xxxxxxxxxxxx33x0000xxxxxxxxxx', 'xxxxxxxxxxxx22x0000xxxxxxxxxx', 'xxxxxxxxxxxx11x0000xxxxxxxxxx', 'xxxxxxxxxxxx00x0000xxxxxxxxxx', 'x000000000000000000xxxxxxxxxx', 'x000000000000000000xxxxxxxxxx', 'x000000000000000000xxxxxxxxxx', 'x000000000000000000xxxxxxxxxx', 'x000000000000000000xxxxxxxxxx', 'x000000000000000000xxxxxxxxxx', 'x000000000000000000xxxxxxxxxx', 'x000000000000000000xxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_5',
            door: {
                row: 10,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'x00000000000000000000000000000000x', 'x00000000000000000000000000000000x', 'x00000000000000000000000000000000x', 'x00000000000000000000000000000000x', 'x00000000000000000000000000000000x', 'x00000000000000000000000000000000x', 'x00000000000000000000000000000000x', 'x00000000000000000000000000000000x', 'x00000000000000000000000000000000x', '000000000000000000000000000000000x', 'x00000000000000000000000000000000x', 'x00000000000000000000000000000000x', 'x00000000000000000000000000000000x', 'x00000000000000000000000000000000x', 'x00000000000000000000000000000000x', 'x00000000000000000000000000000000x', 'x00000000000000000000000000000000x', 'x00000000000000000000000000000000x', 'x00000000000000000000000000000000x', 'x00000000000000000000000000000000x', 'x00000000000000000000000000000000x', 'x00000000000000000000000000000000x', 'x00000000000000000000000000000000x', 'x00000000000000000000000000000000x', 'x00000000000000000000000000000000x', 'x00000000000000000000000000000000x', 'x00000000000000000000000000000000x', 'x00000000000000000000000000000000x', 'x00000000000000000000000000000000x', 'x00000000000000000000000000000000x', 'x00000000000000000000000000000000x', 'x00000000000000000000000000000000x', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_6',
            door: {
                row: 15,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'x222222222x000000000000000000000000xxxx', 'x222222222x000000000000000000000000xxxx', 'x222222222x000000000000000000000000xxxx', 'x222222222x000000000000000000000000xxxx', 'x222222222x000000000000000000000000xxxx', 'x222222222x000000000000000000000000xxxx', 'x222222222x000000000000000000000000xxxx', 'x222222222x000000000000000000000000xxxx', 'x222222222x00000000xxxxxxxx00000000xxxx', 'x11xxxxxxxx00000000xxxxxxxx00000000xxxx', 'x00x000000000000000xxxxxxxx00000000xxxx', 'x00x000000000000000xxxxxxxx00000000xxxx', 'x000000000000000000xxxxxxxx00000000xxxx', 'x000000000000000000xxxxxxxx00000000xxxx', '0000000000000000000xxxxxxxx00000000xxxx', 'x000000000000000000xxxxxxxx00000000xxxx', 'x00x000000000000000xxxxxxxx00000000xxxx', 'x00x000000000000000xxxxxxxx00000000xxxx', 'x00xxxxxxxxxxxxxxxxxxxxxxxx00000000xxxx', 'x00xxxxxxxxxxxxxxxxxxxxxxxx00000000xxxx', 'x00x0000000000000000000000000000000xxxx', 'x00x0000000000000000000000000000000xxxx', 'x0000000000000000000000000000000000xxxx', 'x0000000000000000000000000000000000xxxx', 'x0000000000000000000000000000000000xxxx', 'x0000000000000000000000000000000000xxxx', 'x00x0000000000000000000000000000000xxxx', 'x00x0000000000000000000000000000000xxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_7',
            door: {
                row: 17,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxxxxxx', 'x222222xx00000000xxxxxxxx', 'x222222xx00000000xxxxxxxx', 'x2222221000000000xxxxxxxx', 'x2222221000000000xxxxxxxx', 'x222222xx00000000xxxxxxxx', 'x222222xx00000000xxxxxxxx', 'x222222xxxxxxxxxxxxxxxxxx', 'x222222xkkkkkkxxiiiiiiiix', 'x222222xkkkkkkxxiiiiiiiix', 'x222222xkkkkkkjiiiiiiiiix', 'x222222xkkkkkkjiiiiiiiiix', 'x222222xkkkkkkxxiiiiiiiix', 'xxx11xxxkkkkkkxxiiiiiiiix', 'xxx00xxxkkkkkkxxxxxxxxxxx', 'x000000xkkkkkkxxxxxxxxxxx', 'x000000xkkkkkkxxxxxxxxxxx', '0000000xkkkkkkxxxxxxxxxxx', 'x000000xkkkkkkxxxxxxxxxxx', 'x000000xkkkkkkxxxxxxxxxxx', 'x000000xxxjjxxxxxxxxxxxxx', 'x000000xxxiixxxxxxxxxxxxx', 'x000000xiiiiiixxxxxxxxxxx', 'xxxxxxxxiiiiiixxxxxxxxxxx', 'xxxxxxxxiiiiiixxxxxxxxxxx', 'xxxxxxxxiiiiiixxxxxxxxxxx', 'xxxxxxxxiiiiiixxxxxxxxxxx', 'xxxxxxxxiiiiiixxxxxxxxxxx', 'xxxxxxxxiiiiiixxxxxxxxxxx', 'xxxxxxxxiiiiiixxxxxxxxxxx']
        },
        {
            id: 'model_8',
            door: {
                row: 15,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'x5555555555555555555555555xxxxxxxxx', 'x5555555555555555555555555xxxxxxxxx', 'x5555555555555555555555555xxxxxxxxx', 'x5555555555555555555555555xxxxxxxxx', 'x5555555555555555555555555xxxxxxxxx', 'x5555555555555555555555555xxxxxxxxx', 'x5555555555xxxxxxxxxxxxxxxxxxxxxxxx', 'x55555555554321000000000000000000xx', 'x55555555554321000000000000000000xx', 'x5555555555xxxxx00000000000000000xx', 'x555555x44x0000000000000000000000xx', 'x555555x33x0000000000000000000000xx', 'x555555x22x0000000000000000000000xx', 'x555555x11x0000000000000000000000xx', '5555555x00x0000000000000000000000xx', 'x555555x0000000000000000000000000xx', 'x555555x0000000000000000000000000xx', 'x555555x0000000000000000000000000xx', 'x555555x0000000000000000000000000xx', 'x555555x0000000000000000000000000xx', 'x555555x0000000000000000000000000xx', 'x555555x0000000000000000000000000xx', 'x555555x0000000000000000000000000xx', 'x555555x0000000000000000000000000xx', 'x555555x0000000000000000000000000xx', 'xxxxxxxx0000000000000000000000000xx', 'xxxxxxxx0000000000000000000000000xx', 'xxxxxxxx0000000000000000000000000xx', 'xxxxxxxx0000000000000000000000000xx', 'xxxxxxxx0000000000000000000000000xx', 'xxxxxxxx0000000000000000000000000xx', 'xxxxxxxx0000000000000000000000000xx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_9',
            door: {
                row: 17,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxxxxx', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', '00000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'x0000000000000000000000x', 'xxxxxxxxxxxxxxxxxxxxxxxx']
        }
    ]);

    const existingFurnitureAssets = await getExistingFurnitureAssets();

    await FurnitureModel.bulkCreate(existingFurnitureAssets.flatMap((furnitures) => furnitures).map((furniture) => {
        return {
            id: randomUUID(),
            type: furniture.type,

            name: furniture.name,
            description: furniture.description,

            flags: furniture.flags,

            color: furniture.color,
            placement: furniture.placement,
            dimensions: furniture.dimensions,

            category: furniture.category,
            interactionType: furniture.interactionType,
        };
    }));

    for(let root of defaultShopPages) {
        const page = await ShopPageModel.create({
            id: randomUUID(),

            category: "furniture",
            title: root.title,
            description: root.description,

            icon: root.icon,
            header: root.header
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

                category: "furniture",
                title: child.title,
                description: child.description,

                icon: child.icon,
                header: child.header,

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

    const allFurnitureShopPage = await ShopPageModel.create({
        id: randomUUID(),
        category: "furniture",
        title: "All furniture"
    });

    await ShopPageFurnitureModel.bulkCreate<ShopPageFurnitureModel>((await FurnitureModel.findAll()).map((furniture) => {
        return {
            id: randomUUID(),
            furnitureId: furniture.id,
            shopPageId: allFurnitureShopPage.id
        };
    }));

    await RoomModel.create<RoomModel>({
        id: "room2",
        name: "My room",
        structure: {
            door: {
                row: 0,
                column: 2
            },
            grid: [
                "XX0XXXX",
                "0000000",
                "0000000",
                "0000000",
                "0000000",
                "0000000",
                "0000000"
            ],
            floor: {
                id: "default",
                thickness: 8
            },
            wall: {
                id: "default",
                thickness: 8
            }
        }
    });

    await RoomModel.create<RoomModel>({
        id: "room3",
        name: "My room",
        structure: {
            door: {
                row: 1,
                column: 1
            },
            grid:
    ["xxxxxxxxxxxxxxxxxxxxx", "x00000000000000000000", "x00000000000000000000", "x00000000000000000000", "x00000000000000000000", "x00000000000000000000", "x00000000000000000000", "x00000000000000000000", "x00000000000000000000", "x00000000xxxx00000000", "x00000000xxxx00000000", "x00000000xxxx00000000", "x00000000xxxx00000000", "x00000000xxxx00000000", "x00000000xxxx00000000", "x00000000xxxx00000000", "000000000xxxx00000000", "x00000000xxxx00000000", "x00000000xxxx00000000", "x00000000xxxx00000000", "x00000000xxxx00000000", "xxxxxxxxxxxxxxxxxxxxx"],
            floor: {
                id: "default",
                thickness: 8
            },
            wall: {
                id: "default",
                thickness: 8
            }
        }
    });

    const room = await RoomModel.create<RoomModel>({
        id: "room1",
        name: "My home room",
        structure: {
            door: {
                row: 6,
                column: 0
            },
            grid: [
                "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                "X22222222222222222222222XX22222222222222222222222X",
                "X22222222222222222222222XX22222222222222222222222X",
                "X22222222222222222222222XX22222222222222222222222X",
                "X22222222222222222222222XX22222222222222222222222X",
                "X22222222222222222222222XX22222222222222222222222X",
                "222222222222222222222222XX22222222222222222222222X",
                "X22222222222222222222222XX22222222222222222222222X",
                "X22222222222222222222222XX22222222222222222222222X",
                "X22222222222222222222222XX22222222222222222222222X",
                "X11111111111111111111111XX11111111111111111111111X",
                "X11111111111111111111111XX11111111111111111111111X",
                "X11111111111111111111111XX11111111111111111111111X",
                "X11111111111111111111111XX11111111111111111111111X",
                "X11111111111111111111111XX11111111111111111111111X",
                "X11111111111111111111111XX11111111111111111111111X",
                "X11111111111111111111111XX11111111111111111111111X",
                "X11111111111111111111111XX11111111111111111111111X",
                "X11111111111111111111111XX11111111111111111111111X",
                "X11111111111111111111111XX11111111111111111111111X",
                "X00000000000000000000000XX00000000000000000000000X",
                "X00000000000000000000000XX00000000000000000000000X",
                "X00000000000000000000000XX00000000000000000000000X",
                "X00000000000000000000000XX00000000000000000000000X",
                "X00000000000000000000000XX00000000000000000000000X",
                "X00000000000000000000000XX00000000000000000000000X",
                "X00000000000000000000000XX00000000000000000000000X",
                "X00000000000000000000000XX00000000000000000000000X",
                "X00000000000000000000000XX00000000000000000000000X",
                "XXXXXXXXXXX000XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                "XXXXXXXXXXX000XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                "XXXXXXXXXXX000XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                "XXXXXXXXXXX000XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                "XXXXXXXXXXX000XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                "XXXXXXXXXXX000XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                "XXXXXXXXXXX000XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                "XXXXXXXXXXX000XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                "X00000000000000000000000XXXXXXXXXXXXXXXXXXXXXXXXXX",
                "X00000000000000000000000XXXXXXXXXXXXXXXXXXXXXXXXXX",
                "X00000000000000000000000XXXXXXXXXXXXXXXXXXXXXXXXXX",
                "X00000000000000000000000XXXXXXXXXXXXXXXXXXXXXXXXXX",
                "X00000000000000000000000XXXXXXXXXXXXXXXXXXXXXXXXXX",
                "X00000000000000000000000XXXXXXXXXXXXXXXXXXXXXXXXXX",
                "X00000000000000000000000XXXXXXXXXXXXXXXXXXXXXXXXXX",
                "X00000000000000000000000XXXXXXXXXXXXXXXXXXXXXXXXXX",
                "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX0"
            ],
            floor: {
                id: "101",
                thickness: 8
            },
            wall: {
                id: "2301",
                thickness: 8
            }
        }
    });

    const furniture = (await FurnitureModel.findOne({ where: { type: "rare_dragonlamp", color: 1 } }));

    const user = await UserModel.create({
        id: "user1",
        name: "Muff1n-Pixel",
        figureConfiguration: [{ "type": "hd", "setId": "180", "colors": [2] }, { "type": "hr", "setId": "828", "colors": [31] }, { "type": "ea", "setId": "3196", "colors": [62] }, { "type": "ch", "setId": "255", "colors": [1415] }, { "type": "lg", "setId": "3216", "colors": [110] }, { "type": "sh", "setId": "305", "colors": [62] }],
        homeRoomId: "room1"
    });

    for (let color = 0; color < 3; color++)
        for (let direction = 0; direction < 2; direction++)
            for (let index = 0; index < 20; index++) {
                await RoomFurnitureModel.create<RoomFurnitureModel>({
                    id: randomUUID(),
                    roomId: room.id,
                    furnitureId: furniture!.id,
                    userId: user.id,
                    position: {
                        row: (11 + (color * 2)) + direction,
                        column: 1 + index,
                        depth: 1
                    },
                    direction: (direction === 0) ? (2) : (4),
                    animation: 1
                });
            }

    await UserFurnitureModel.bulkCreate([
        {
            id: randomUUID(),
            userId: user.id,
            furnitureId: furniture!.id
        },
        {
            id: randomUUID(),
            userId: user.id,
            furnitureId: (await FurnitureModel.findOne({ where: { type: "rare_dragonlamp", color: 2 } }))!.id
        },
        {
            id: randomUUID(),
            userId: user.id,
            furnitureId: (await FurnitureModel.findOne({ where: { type: "roomdimmer" } }))!.id
        }
    ]);

    await UserModel.create({
        id: "user2",
        name: "Cake",
        figureConfiguration: [{ "type": "hd", "setId": "180", "colors": [2] }, { "type": "hr", "setId": "828", "colors": [31] }, { "type": "ch", "setId": "255", "colors": [1415] }, { "type": "lg", "setId": "3216", "colors": [110] }, { "type": "sh", "setId": "305", "colors": [62] }]
    });
}

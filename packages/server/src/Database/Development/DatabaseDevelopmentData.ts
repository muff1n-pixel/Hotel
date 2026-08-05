import { randomBytes, randomUUID } from "crypto";
import { FurnitureModel } from "../Models/Furniture/FurnitureModel.js";
import { getExistingFurnitureAssets, getFloorIds, getWallIds } from "./FurnitureDevelopmentData.js";
import { UserModel } from "../Models/Users/UserModel.js";
import { RoomMapModel } from "../Models/Rooms/Maps/RoomMapModel.js";
import { RoomChatStyleModel } from "../Models/Rooms/Chat/Styles/RoomChatStyleModel.js";
import { recreateShopPages } from "./ShopDevelopmentData.js";
import { UserTokenModel } from "../Models/Users/UserTokens/UserTokenModel.js";

export async function initializeDevelopmentData() {
    await UserTokenModel.create({
        id: randomUUID(),
        secretKey: randomBytes(32).toString("hex")
    });

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
            index: 23,
            indexable: true,
            door: {
                row: 3,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'x00000000xx0000000000xx0000x', 'x00000000xx0000000000xx0000x', '000000000xx0000000000xx0000x', 'x00000000xx0000000000xx0000x', 'x00000000xx0000xx0000xx0000x', 'x00000000xx0000xx0000xx0000x', 'x00000000xx0000xx0000000000x', 'x00000000xx0000xx0000000000x', 'xxxxx0000xx0000xx0000000000x', 'xxxxx0000xx0000xx0000000000x', 'xxxxx0000xx0000xxxxxxxxxxxxx', 'xxxxx0000xx0000xxxxxxxxxxxxx', 'x00000000xx0000000000000000x', 'x00000000xx0000000000000000x', 'x00000000xx0000000000000000x', 'x00000000xx0000000000000000x', 'x0000xxxxxxxxxxxxxxxxxx0000x', 'x0000xxxxxxxxxxxxxxxxxx0000x', 'x00000000000000000000000000x', 'x00000000000000000000000000x', 'x00000000000000000000000000x', 'x00000000000000000000000000x', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_u',
            index: 19,
            indexable: true,
            door: {
                row: 17,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxxxxx', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', '11111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'x1111100000000000000000x', 'xxxxxxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_z',
            index: 24,
            indexable: true,
            door: {
                row: 9,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxx00000000000000000000', 'xxxxxxxxxxx00000000000000000000', 'xxxxxxxxxxx00000000000000000000', 'x00000000xx00000000000000000000', 'x00000000xx00000000000000000000', 'x00000000xx00000000000000000000', 'x00000000xx00000000000000000000', 'x00000000xx00000000000000000000', '000000000xx00000000000000000000', 'x00000000xx00000000000000000000', 'x00000000xx00000000000000000000', 'x00000000xx00000000000000000000', 'x00000000xx00000000000000000000', 'x00000000xx00000000000000000000', 'x00000000xx00000000000000000000', 'xxxxxxxxxxx00000000000000000000', 'xxxxxxxxxxx00000000000000000000', 'xxxxxxxxxxx00000000000000000000', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_w',
            index: 21,
            indexable: true,
            door: {
                row: 3,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxxxxxxxx', 'x2222xx1111111111xx11111111', 'x2222xx1111111111xx11111111', '222222111111111111111111111', 'x22222111111111111111111111', 'x22222111111111111111111111', 'x22222111111111111111111111', 'x2222xx1111111111xx11111111', 'x2222xx1111111111xx11111111', 'x2222xx1111111111xxxx1111xx', 'x2222xx1111111111xxxx0000xx', 'xxxxxxx1111111111xx00000000', 'xxxxxxx1111111111xx00000000', 'x22222111111111111000000000', 'x22222111111111111000000000', 'x22222111111111111000000000', 'x22222111111111111000000000', 'x2222xx1111111111xx00000000', 'x2222xx1111111111xx00000000', 'x2222xxxx1111xxxxxxxxxxxxxx', 'x2222xxxx0000xxxxxxxxxxxxxx', 'x2222x0000000000xxxxxxxxxxx', 'x2222x0000000000xxxxxxxxxxx', 'x2222x0000000000xxxxxxxxxxx', 'x2222x0000000000xxxxxxxxxxx', 'x2222x0000000000xxxxxxxxxxx', 'x2222x0000000000xxxxxxxxxxx']
        },
        {
            id: 'model_x',
            index: 22,
            indexable: true,
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
            index: 20,
            indexable: true,
            door: {
                row: 3,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxx', 'x222221111111111111x', 'x222221111111111111x', '2222221111111111111x', 'x222221111111111111x', 'x222221111111111111x', 'x222221111111111111x', 'xxxxxxxx1111xxxxxxxx', 'xxxxxxxx0000xxxxxxxx', 'x000000x0000x000000x', 'x000000x0000x000000x', 'x00000000000x000000x', 'x00000000000x000000x', 'x000000000000000000x', 'x000000000000000000x', 'xxxxxxxx00000000000x', 'x000000x00000000000x', 'x000000x0000xxxxxxxx', 'x00000000000x000000x', 'x00000000000x000000x', 'x00000000000x000000x', 'x00000000000x000000x', 'xxxxxxxx0000x000000x', 'x000000x0000x000000x', 'x000000x0000x000000x', 'x000000000000000000x', 'x000000000000000000x', 'x000000000000000000x', 'x000000000000000000x', 'xxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_t',
            index: 18,
            indexable: true,
            door: {
                row: 3,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'x222222222222222222222222222x', 'x222222222222222222222222222x', '2222222222222222222222222222x', 'x222222222222222222222222222x', 'x2222xxxxxx222222xxxxxxx2222x', 'x2222xxxxxx111111xxxxxxx2222x', 'x2222xx111111111111111xx2222x', 'x2222xx111111111111111xx2222x', 'x2222xx11xxx1111xxxx11xx2222x', 'x2222xx11xxx0000xxxx11xx2222x', 'x22222111x00000000xx11xx2222x', 'x22222111x00000000xx11xx2222x', 'x22222111x00000000xx11xx2222x', 'x22222111x00000000xx11xx2222x', 'x22222111x00000000xx11xx2222x', 'x22222111x00000000xx11xx2222x', 'x2222xx11xxxxxxxxxxx11xx2222x', 'x2222xx11xxxxxxxxxxx11xx2222x', 'x2222xx111111111111111xx2222x', 'x2222xx111111111111111xx2222x', 'x2222xxxxxxxxxxxxxxxxxxx2222x', 'x2222xxxxxxxxxxxxxxxxxxx2222x', 'x222222222222222222222222222x', 'x222222222222222222222222222x', 'x222222222222222222222222222x', 'x222222222222222222222222222x', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_h',
            index: 7,
            indexable: true,
            door: {
                row: 4,
                column: 4,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxx111111x', 'xxxxx111111x', 'xxxx1111111x', 'xxxxx111111x', 'xxxxx111111x', 'xxxxx000000x', 'xxxxx000000x', 'xxx00000000x', 'xxx00000000x', 'xxx00000000x', 'xxx00000000x', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx']
        },
        {
            id: 'model_p',
            index: 15,
            indexable: true,
            door: {
                row: 23,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxx', 'xxxxxxx222222222222', 'xxxxxxx222222222222', 'xxxxxxx222222222222', 'xxxxxxx222222222222', 'xxxxxxx222222222222', 'xxxxxxx222222222222', 'xxxxxxx22222222xxxx', 'xxxxxxx11111111xxxx', 'x222221111111111111', 'x222221111111111111', 'x222221111111111111', 'x222221111111111111', 'x222221111111111111', 'x222221111111111111', 'x222221111111111111', 'x222221111111111111', 'x2222xx11111111xxxx', 'x2222xx00000000xxxx', 'x2222xx000000000000', 'x2222xx000000000000', 'x2222xx000000000000', 'x2222xx000000000000', '22222xx000000000000', 'x2222xx000000000000', 'xxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_r',
            index: 17,
            indexable: true,
            door: {
                row: 4,
                column: 10,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxx33333333333333', 'xxxxxxxxxxx33333333333333', 'xxxxxxxxxxx33333333333333', 'xxxxxxxxxx333333333333333', 'xxxxxxxxxxx33333333333333', 'xxxxxxxxxxx33333333333333', 'xxxxxxx333333333333333333', 'xxxxxxx333333333333333333', 'xxxxxxx333333333333333333', 'xxxxxxx333333333333333333', 'xxxxxxx333333333333333333', 'xxxxxxx333333333333333333', 'x4444433333xxxxxxxxxxxxxx', 'x4444433333xxxxxxxxxxxxxx', 'x44444333333222xx000000xx', 'x44444333333222xx000000xx', 'xxx44xxxxxxxx22xx000000xx', 'xxx33xxxxxxxx11xx000000xx', 'xxx33322222211110000000xx', 'xxx33322222211110000000xx', 'xxxxxxxxxxxxxxxxx000000xx', 'xxxxxxxxxxxxxxxxx000000xx', 'xxxxxxxxxxxxxxxxx000000xx', 'xxxxxxxxxxxxxxxxx000000xx', 'xxxxxxxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_q',
            index: 16,
            indexable: true,
            door: {
                row: 4,
                column: 10,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxx22222222', 'xxxxxxxxxxx22222222', 'xxxxxxxxxxx22222222', 'xxxxxxxxxx222222222', 'xxxxxxxxxxx22222222', 'xxxxxxxxxxx22222222', 'x222222222222222222', 'x222222222222222222', 'x222222222222222222', 'x222222222222222222', 'x222222222222222222', 'x222222222222222222', 'x2222xxxxxxxxxxxxxx', 'x2222xxxxxxxxxxxxxx', 'x2222211111xx000000', 'x222221111110000000', 'x222221111110000000', 'x2222211111xx000000', 'xx22xxx1111xxxxxxxx', 'xx11xxx1111xxxxxxxx', 'x1111xx1111xx000000', 'x1111xx111110000000', 'x1111xx111110000000', 'x1111xx1111xx000000', 'xxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_o',
            index: 14,
            indexable: true,
            door: {
                row: 18,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxx11111111xxxx', 'xxxxxxxxxxxxx11111111xxxx', 'xxxxxxxxxxxxx11111111xxxx', 'xxxxxxxxxxxxx11111111xxxx', 'xxxxxxxxxxxxx11111111xxxx', 'xxxxxxxxxxxxx11111111xxxx', 'xxxxxxxxxxxxx11111111xxxx', 'xxxxxxxxxxxxx00000000xxxx', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'x111111100000000000000000', 'x111111100000000000000000', 'x111111100000000000000000', '1111111100000000000000000', 'x111111100000000000000000', 'x111111100000000000000000', 'x111111100000000000000000', 'x111111100000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_n',
            index: 13,
            indexable: true,
            door: {
                row: 16,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxx', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x000000xxxxxxxx000000', 'x000000x000000x000000', 'x000000x000000x000000', 'x000000x000000x000000', 'x000000x000000x000000', 'x000000x000000x000000', 'x000000x000000x000000', 'x000000xxxxxxxx000000', 'x00000000000000000000', '000000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'xxxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_g',
            index: 6,
            indexable: true,
            door: {
                row: 7,
                column: 1,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxx00000', 'xxxxxxx00000', 'xxxxxxx00000', 'xx1111000000', 'xx1111000000', 'x11111000000', 'xx1111000000', 'xx1111000000', 'xxxxxxx00000', 'xxxxxxx00000', 'xxxxxxx00000', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx']
        },
        {
            id: 'model_l',
            index: 11,
            indexable: true,
            door: {
                row: 16,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxx', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000xxxx00000000', 'x00000000xxxx00000000', 'x00000000xxxx00000000', 'x00000000xxxx00000000', 'x00000000xxxx00000000', 'x00000000xxxx00000000', 'x00000000xxxx00000000', '000000000xxxx00000000', 'x00000000xxxx00000000', 'x00000000xxxx00000000', 'x00000000xxxx00000000', 'x00000000xxxx00000000', 'xxxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_m',
            index: 12,
            indexable: true,
            door: {
                row: 15,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'x0000000000000000000000000000', 'x0000000000000000000000000000', 'x0000000000000000000000000000', 'x0000000000000000000000000000', '00000000000000000000000000000', 'x0000000000000000000000000000', 'x0000000000000000000000000000', 'x0000000000000000000000000000', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxx00000000xxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_k',
            index: 10,
            indexable: true,
            door: {
                row: 13,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxx00000000', 'xxxxxxxxxxxxxxxxx00000000', 'xxxxxxxxxxxxxxxxx00000000', 'xxxxxxxxxxxxxxxxx00000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'x000000000000000000000000', 'x000000000000000000000000', 'x000000000000000000000000', 'x000000000000000000000000', '0000000000000000000000000', 'x000000000000000000000000', 'x000000000000000000000000', 'x000000000000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxx0000000000000000', 'xxxxxxxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_j',
            index: 9,
            indexable: true,
            door: {
                row: 10,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxx0000000000', 'xxxxxxxxxxx0000000000', 'xxxxxxxxxxx0000000000', 'xxxxxxxxxxx0000000000', 'xxxxxxxxxxx0000000000', 'xxxxxxxxxxx0000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', '000000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x00000000000000000000', 'x0000000000xxxxxxxxxx', 'x0000000000xxxxxxxxxx', 'x0000000000xxxxxxxxxx', 'x0000000000xxxxxxxxxx', 'x0000000000xxxxxxxxxx', 'x0000000000xxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_i',
            index: 8,
            indexable: true,
            door: {
                row: 10,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxxxxxxx', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', '00000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'x0000000000000000', 'xxxxxxxxxxxxxxxxx']
        },
        {
            id: 'model_e',
            index: 4,
            indexable: true,
            door: {
                row: 5,
                column: 1,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xx0000000000', 'xx0000000000', 'x00000000000', 'xx0000000000', 'xx0000000000', 'xx0000000000', 'xx0000000000', 'xx0000000000', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx']
        },
        {
            id: 'model_f',
            index: 5,
            indexable: true,
            door: {
                row: 5,
                column: 2,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxx', 'xxxxxxx0000x', 'xxxxxxx0000x', 'xxx00000000x', 'xxx00000000x', 'xx000000000x', 'xxx00000000x', 'x0000000000x', 'x0000000000x', 'x0000000000x', 'x0000000000x', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx']
        },
        {
            id: 'model_a',
            index: 0,
            indexable: true,
            door: {
                row: 5,
                column: 3,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxx', 'xxxx00000000', 'xxxx00000000', 'xxxx00000000', 'xxxx00000000', 'xxx000000000', 'xxxx00000000', 'xxxx00000000', 'xxxx00000000', 'xxxx00000000', 'xxxx00000000', 'xxxx00000000', 'xxxx00000000', 'xxxx00000000', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx']
        },
        {
            id: 'model_b',
            index: 1,
            indexable: true,
            door: {
                row: 5,
                column: 0,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxx', 'xxxxx0000000', 'xxxxx0000000', 'xxxxx0000000', 'xxxxx0000000', '000000000000', 'x00000000000', 'x00000000000', 'x00000000000', 'x00000000000', 'x00000000000', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx']
        },
        {
            id: 'model_c',
            index: 2,
            indexable: true,
            door: {
                row: 7,
                column: 4,
                direction: 2,
            },
            grid: ['xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxx000000x', 'xxxxx000000x', 'xxxx0000000x', 'xxxxx000000x', 'xxxxx000000x', 'xxxxx000000x', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx']
        },
        {
            id: 'model_d',
            index: 3,
            indexable: true,
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
            customParams: furniture.customParams
        };
    }));

    await recreateShopPages();

    await UserModel.create({
        id: "user1",
        name: "Muff1n-Pixel",
        figureConfiguration: [{ "type": "hd", "setId": "180", "colors": [2] }, { "type": "hr", "setId": "828", "colors": [31] }, { "type": "ea", "setId": "3196", "colors": [62] }, { "type": "ch", "setId": "255", "colors": [1415] }, { "type": "lg", "setId": "3216", "colors": [110] }, { "type": "sh", "setId": "305", "colors": [62] }],
    });

    await UserModel.create({
        id: "user2",
        name: "Cake",
        figureConfiguration: [{ "type": "hd", "setId": "180", "colors": [2] }, { "type": "hr", "setId": "828", "colors": [31] }, { "type": "ch", "setId": "255", "colors": [1415] }, { "type": "lg", "setId": "3216", "colors": [110] }, { "type": "sh", "setId": "305", "colors": [62] }]
    });
}

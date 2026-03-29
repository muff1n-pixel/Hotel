import { AchievementModel } from "../AchievementModel";

export type RoomBuilderAchievements =
    "RoomBuilder"
    | "FurniCollector"
    | "RoomHost"
    | "IceRinkBuilder"
    | "SnowBoardBuilder"
    | "GameArcadeOwner";

export default class RoomBuilderAchievementsSeeder {
    public static async seedAchievements() {
        await AchievementModel.upsert({
            id: "RoomBuilder",
            categoryId: "room_builder",
            name: "Room Builder",
            description: "For building a room with %score% items of furni.",
            badgePrefix: "ACH_RoomDecoFurniCount",
            levels: [
                15, 20, 25, 30, 35, 45, 55, 65, 80, 95, 110, 130, 150, 170, 200, 230, 270, 310, 360, 410
            ]
        });

        await AchievementModel.upsert({
            id: "FurniCollector",
            categoryId: "room_builder",
            name: "Furni Collector",
            description: "For collecting %score% different items of furni.",
            badgePrefix: "ACH_RoomDecoFurniTypeCount",
            levels: [
                10, 12, 14, 19, 24, 29, 39, 49, 59, 74, 89, 104, 124, 144, 174, 204, 244, 284, 334, 384
            ]
        });

        await AchievementModel.upsert({
            id: "RoomHost",
            categoryId: "room_builder",
            name: "Room Host",
            description: "For having other Habbos spend %score% minutes in a room.",
            badgePrefix: "ACH_RoomDecoHosting",
            levels: [
                5, 15, 20, 40, 90, 190, 390, 790, 1790, 3790, 7790, 17790, 37790, 77790, 177790, 677790, 1677790, 6677790, 33355580
            ]
        });

        await AchievementModel.upsert({
            id: "IceRinkBuilder",
            categoryId: "room_builder",
            name: "Ice Rink Builder",
            description: "For creating an Ice Rink using %score% Skating Patches.",
            badgePrefix: "ACH_TagA",
            levels: [
                10, 20, 30, 45, 60, 80, 100, 125, 150, 170
            ]
        });

        await AchievementModel.upsert({
            id: "SnowBoardBuilder",
            categoryId: "room_builder",
            name: "Snowboarding Builder",
            description: "For creating a slope using %score% Snowboard Patches.",
            badgePrefix: "ACH_snowBoardBuild",
            levels: [
                16, 36, 64, 100, 160
            ]
        });

        await AchievementModel.upsert({
            id: "GameArcadeOwner",
            categoryId: "room_builder",
            name: "Game Arcade Owner",
            description: "For having users score %score% points in your game rooms.",
            badgePrefix: "ACH_GameAuthorExperience",
            levels: [
                400, 1000, 2000, 3600, 6200, 10400, 17100, 27800, 45000, 77600, 139600, 257600, 481600, 906600, 1714600, 3250600, 6168600, 11712600, 22245600, 42258600
            ]
        });
    }
}
import { AchievementModel } from "../AchievementModel";

export type RoomBuilderAchievements =
    "RoomBuilder"
    | "FurniCollector"
    | "IceRinkBuilder"
    | "SnowBoardBuilder";

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
                10, 20, 30, 45, 60, 80, 100, 125, 150, 170
            ]
        });
    }
}
import { game } from "../../../..";
import { FurnitureModel } from "../../Furniture/FurnitureModel";
import { UserFurnitureModel } from "../../Users/Furniture/UserFurnitureModel";
import { AchievementModel } from "../AchievementModel";

export type RoomBuilderAchievements =
    "IceRinkBuilder"
    | "SnowBoardBuilder";

export default class RoomBuilderAchievementsSeeder {
    public static async seedAchievements() {
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
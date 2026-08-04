import { AchievementModel } from "../AchievementModel";
import BattleBanzaiAchievementsSeeder, { BattleBanzaiAchievements } from "./Games/BattleBanzaiAchievementsSeeder";
import BunnyRunAchievementsSeeder, { BunnyRunAchievements } from "./Games/BunnyRunAchievementsSeeder";
import FootballAchievementsSeeder, { FootballAchievements } from "./Games/FootballAchievementsSeeder";
import FreezeAchievementsSeeder, { FreezeAchievements } from "./Games/FreezeAchievementsSeeder";
import IceTagAchievementsSeeder, { IceTagAchievements } from "./Games/IceTagAchievementsSeeder";
import SkateboardAchievementsSeeder, { SkateboardAchievements } from "./Games/SkateboardAchievementsSeeder";
import SnowboardAchievementsSeeder, { SnowboardAchievements } from "./Games/SnowboardAchievementsSeeder";

export type GameAchievements = 
    "Player"
    | IceTagAchievements
    | FreezeAchievements
    | BattleBanzaiAchievements
    | SkateboardAchievements
    | BunnyRunAchievements
    | SnowboardAchievements
    | FootballAchievements;

export default class GameAchievementsSeeder {
    public static async seedAchievements() {
        await AchievementModel.upsert({
            id: "Player",
            categoryId: "games",
            name: "Playeer",
            description: "For earning %score% victory points playing games.",
            badgePrefix: "ACH_GamePlayerExperience",
            levels: [
                100, 250, 480, 820, 1330, 2090, 3230, 4930, 7530, 12430, 21730, 39330, 72730, 136230, 256830, 485930, 921230, 1748230, 3319530, 6305030
            ],
            duckets: Array(20).fill(null).map((_, index) => (index + 1) * 1000)
        });

        await BattleBanzaiAchievementsSeeder.seedAchievements();
        await FreezeAchievementsSeeder.seedAchievements();
        await IceTagAchievementsSeeder.seedAchievements();
        await SkateboardAchievementsSeeder.seedAchievements();
        await BunnyRunAchievementsSeeder.seedAchievements();
        await SnowboardAchievementsSeeder.seedAchievements();
        await FootballAchievementsSeeder.seedAchievements();
    }
}
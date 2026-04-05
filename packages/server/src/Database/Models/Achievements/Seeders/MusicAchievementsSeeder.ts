import { AchievementModel } from "../AchievementModel";

export type MusicAchievements =
    "MusicPlayer"
    | "MusicCollector";

export default class MusicAchievementsSeeder {
    public static async seedAchievements() {
        await AchievementModel.upsert({
            id: "MusicPlayer",
            categoryId: "music",
            name: "Music Player",
            description: "For playing %score% minutes of music in a room.",
            badgePrefix: "ACH_MusicPlayer",
            levels: [
                5, 105, 305, 605, 1005, 1505, 2105, 2805, 3605, 4605, 6605, 9605, 13605, 18605, 24605, 31605, 39605, 49605, 64605, 94605
            ]
        });
        
        await AchievementModel.upsert({
            id: "MusicCollector",
            categoryId: "music",
            name: "Music Collector",
            description: "For purchasing %score% sounds from the catalogue.",
            badgePrefix: "ACH_MusicCollector",
            levels: [
                2, 5, 9, 14, 20, 27, 35, 44, 54, 69
            ]
        });
    }
}
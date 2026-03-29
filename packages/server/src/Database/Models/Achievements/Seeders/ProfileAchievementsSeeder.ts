import { AchievementModel } from "../AchievementModel";

export type ProfileAchievements =
    "TrueHabbo";

export default class ProfileAchievementsSeeder {
    public static async seedAchievements() {
        await AchievementModel.upsert({
            id: "TrueHabbo",
            categoryId: "profile",
            name: "True Habbo",
            description: "For building registered on Habbo for %score% days.",
            badgePrefix: "ACH_RegistrationDuration",
            levels: [
                1, 3, 10, 20, 30, 56, 84, 112, 168, 224, 280, 365, 548, 730, 913, 1095, 1278, 1460, 1643, 1825
            ]
        });
    }
}
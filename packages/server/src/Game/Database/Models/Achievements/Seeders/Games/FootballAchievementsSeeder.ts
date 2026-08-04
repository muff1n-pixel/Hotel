import { AchievementModel } from "../../AchievementModel";

export type FootballAchievements = 
    "FootballGoalScorer"
    | "FootballGoalHost";

export default class FootballAchievementsSeeder {
    public static async seedAchievements() {
        await AchievementModel.upsert({
            id: "FootballGoalScorer",
            categoryId: "games",
            name: "Football Goal Scorer",
            description: "For scoring %score% goals in Habbo Football.",
            badgePrefix: "ACH_FootballGoalScored",
            levels: [
                1, 10, 100, 1000, 10000
            ],
            duckets: Array(5).fill(null).map((_, index) => (index + 1) * 1000)
        });
        
        await AchievementModel.upsert({
            id: "FootballGoalHost",
            categoryId: "games",
            name: "Football Goal Host",
            description: "For having %score% goals scored in a player's room.",
            badgePrefix: "ACH_FootballGoalScoredInRoom",
            levels: [
                1, 20, 400, 8000, 160000
            ],
            duckets: Array(5).fill(null).map((_, index) => (index + 1) * 1000)
        });
    }
}
import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { BadgeModel } from "../Badges/BadgeModel";
import RomanNumerals from "../../../Helpers/RomanNumerals";
import { AchievementCategoryModel } from "./AchievementCategoryModel";
import GameAchievementsSeeder, { GameAchievements } from "./Seeders/GameAchievementsSeeder";
import RoomBuilderAchievementsSeeder, { RoomBuilderAchievements } from "./Seeders/RoomBuilderAchievementsSeeder";
import ProfileAchievementsSeeder, { ProfileAchievements } from "./Seeders/ProfileAchievementsSeeder";
import MusicAchievementsSeeder, { MusicAchievements } from "./Seeders/MusicAchievementsSeeder";

export type AchievementId =
    GameAchievements
    | RoomBuilderAchievements
    | ProfileAchievements
    | MusicAchievements;

export class AchievementModel extends Model {
    declare id: AchievementId;
    declare name: string;
    declare description: string;
    declare badgePrefix: string;
    declare levels: number[];
    
    declare category: NonAttribute<AchievementCategoryModel>;
}

export function initializeAchievementModel(sequelize: Sequelize) {
    AchievementModel.init(
        {
            id: {
                type: new DataTypes.STRING(32),
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            badgePrefix: {
                type: new DataTypes.STRING(32),
                allowNull: false
            },
            levels: {
                type: DataTypes.TEXT,
                get: function () {
                    return JSON.parse(this.getDataValue("levels"));
                },
                set: function (value) {
                    this.setDataValue("levels", JSON.stringify(value));
                },
                allowNull: false
            },
        },
        {
            tableName: 'achievements',
            sequelize
        },
    );
    
    AchievementModel.belongsTo(BadgeModel, {
        as: "badge",
        foreignKey: "badgeId"
    });
}

export async function seedAchievements() {
    await AchievementCategoryModel.upsert({
        id: "profile",
        name: "Your profile",
        iconImage: "identity.png"
    });

    await AchievementCategoryModel.upsert({
        id: "social",
        name: "Make friends",
        iconImage: "social.png"
    });

    await AchievementCategoryModel.upsert({
        id: "explore",
        name: "Explore Habbo",
        iconImage: "explore.png"
    });

    await AchievementCategoryModel.upsert({
        id: "pets",
        name: "Pets",
        iconImage: "pets.png"
    });

    await AchievementCategoryModel.upsert({
        id: "games",
        name: "Games",
        iconImage: "games.png"
    });

    await AchievementCategoryModel.upsert({
        id: "room_builder",
        name: "Build your room",
        iconImage: "room_builder.png"
    });

    await AchievementCategoryModel.upsert({
        id: "music",
        name: "Music",
        iconImage: "music.png"
    });

    await RoomBuilderAchievementsSeeder.seedAchievements();
    await GameAchievementsSeeder.seedAchievements();
    await ProfileAchievementsSeeder.seedAchievements();
    await MusicAchievementsSeeder.seedAchievements();

    const achievements = await AchievementModel.findAll();

    await Promise.all(achievements.flatMap((achievement) => {
        return achievement.levels.map(async (level, index) => {
            return await BadgeModel.upsert({
                id: `${achievement.badgePrefix}${index + 1}`,
                name: `${achievement.name} ${new RomanNumerals(index + 1).toString()}`,
                description: achievement.description.replace('%score%', new Intl.NumberFormat('en-US').format(level)),
                image: `${achievement.badgePrefix}${index + 1}.gif`
            })
        })
    }))
}

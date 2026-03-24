import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { BadgeModel } from "../Badges/BadgeModel";
import RomanNumerals from "../../../Helpers/RomanNumerals";
import { UserFurnitureModel } from "../Users/Furniture/UserFurnitureModel";
import { FurnitureModel } from "../Furniture/FurnitureModel";
import { game } from "../../..";
import { AchievementCategoryModel } from "./AchievementCategoryModel";
import IceTagAchievementsSeeder, { IceTagAchievements } from "./Seeders/IceTagAchievementsSeeder";
import FreezeAchievementsSeeder, { FreezeAchievements } from "./Seeders/FreezeAchievementsSeeder";

export type AchievementId =
    IceTagAchievements
    | FreezeAchievements;

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

    await IceTagAchievementsSeeder.seedAchievements();
    await FreezeAchievementsSeeder.seedAchievements();

    UserFurnitureModel.addHook("afterCreate", async (userFurniture: UserFurnitureModel) => {
        if(!userFurniture.userId) {
            return;
        }
        
        const furniture = await FurnitureModel.findByPk(userFurniture.furnitureId);

        if(furniture?.interactionType === "icetag_field") {
            const user = game.getUserById(userFurniture.userId);

            if(user) {
                await user.achievements.addAchievementScore("IceRinkBuilder", 1);
            }
        }
    });

    const achievements = await AchievementModel.findAll();

    await Promise.all(achievements.flatMap((achievement) => {
        return achievement.levels.map(async (level, index) => {
            return await BadgeModel.update({
                name: `${achievement.name} ${new RomanNumerals(index + 1).toString()}`,
                description: achievement.description.replace('%score%', new Intl.NumberFormat('en-US').format(level))
            }, {
                where: {
                    id: `${achievement.badgePrefix}${index + 1}`,
                }
            })
        })
    }))
}

import { DataTypes, Model, Sequelize } from "sequelize";
import { BadgeModel } from "../Badges/BadgeModel";
import RomanNumerals from "../../../Helpers/RomanNumerals";
import { UserFurnitureModel } from "../Users/Furniture/UserFurnitureModel";
import { FurnitureModel } from "../Furniture/FurnitureModel";
import { game } from "../../..";

export type AchievementId =
    "BladesOfGlory"
    | "IceIceBadge"
    | "IceRinkBuilder";

export class AchievementModel extends Model {
    declare id: AchievementId;
    declare name: string;
    declare description: string;
    declare badgePrefix: string;
    declare levels: number[];
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
    await AchievementModel.upsert({
        id: "BladesOfGlory",
        name: "Blades Of Glory",
        description: "For being caught %score% times while playing Ice Tag.",
        badgePrefix: "ACH_TagB",
        levels: [
            1, 4, 9, 17, 29, 44, 62, 87, 114, 144, 186, 242, 314, 402, 498, 618, 754, 905, 1084, 1284
        ]
    });
    
    await AchievementModel.upsert({
        id: "IceIceBadge",
        name: "Ice Ice baby",
        description: "For spending %score% minutes on a skate rink.",
        badgePrefix: "ACH_TagC",
        levels: [
            3, 8, 16, 31, 51, 81, 121, 171, 231, 301, 381, 471, 571, 681, 801, 931, 1071, 1221, 1381, 1551
        ]
    });
    
    await AchievementModel.upsert({
        id: "IceRinkBuilder",
        name: "Ice Rink Builder",
        description: "For creating an Ice Rink using %score% Skating Patches.",
        badgePrefix: "ACH_TagA",
        levels: [
            10, 20, 30, 45, 60, 80, 100, 125, 150, 170
        ]
    });

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

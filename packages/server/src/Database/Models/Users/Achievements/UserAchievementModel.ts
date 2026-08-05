import { DataTypes, Model, Sequelize } from "sequelize";
import { NonAttribute } from "@sequelize/core";
import { UserModel } from "../UserModel.js";
import { AchievementModel } from "../../Achievements/AchievementModel.js";

export class UserAchievementModel extends Model {
    declare id: string;
    declare level: number;
    declare score: number;

    declare user: NonAttribute<UserModel>;
    declare achievement: NonAttribute<AchievementModel>;
    declare achievementId: NonAttribute<string>;
}

export function initializeUserAchievementModel(sequelize: Sequelize) {
    UserAchievementModel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            level: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            score: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
        },
        {
            tableName: 'user_achievements',
            sequelize,
            indexes: [
                {
                    unique: true,
                    fields: ["userId", "achievementId"],
                },
            ],
        },
    );

    UserAchievementModel.belongsTo(UserModel, {
        as: "user",
        foreignKey: "userId",
        constraints: false
    });

    UserAchievementModel.belongsTo(AchievementModel, {
        as: "achievement",
        foreignKey: "achievementId"
    });
}

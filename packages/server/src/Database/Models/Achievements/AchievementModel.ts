import { DataTypes, Model, Sequelize } from "sequelize";
import { BadgeModel } from "../Badges/BadgeModel";

export type AchievementId = "BladesOfGlory";

export class AchievementModel extends Model {
    declare id: AchievementId;
    declare name: string;
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
        name: "Blades of Glory",
        badgePrefix: "ACH_TagB",
        levels: [
            1,
            4,
            9,
            17,
            29,
            44,
            62,
            87,
            114,
            144,
            186,
            242,
            314,
            402,
            498,
            618,
            754,
            905,
            1084,
            1284
        ]
    });
}

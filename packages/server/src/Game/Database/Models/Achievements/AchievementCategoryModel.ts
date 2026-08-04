import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { AchievementModel } from "./AchievementModel";

export class AchievementCategoryModel extends Model {
    declare id: string;
    declare name: string;
    declare iconImage: string;

    declare achievements: NonAttribute<AchievementModel[]>;
}

export function initializeAchievementCategoryModel(sequelize: Sequelize) {
    AchievementCategoryModel.init(
        {
            id: {
                type: new DataTypes.STRING(32),
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            iconImage: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: 'achievement_categories',
            sequelize
        },
    );
    
    AchievementCategoryModel.hasMany(AchievementModel, {
        as: "achievements",
        foreignKey: "categoryId",
        constraints: false
    });
        
    AchievementModel.belongsTo(AchievementCategoryModel, {
        as: "category",
        foreignKey: "categoryId"
    });
}

import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { FurnitureCrackableRewardModel } from "./FurnitureCrackableRewardModel";
import { FurnitureModel } from "../FurnitureModel";

export class FurnitureCrackableModel extends Model {
    declare id: string;
    declare requiredClicks: number;

    declare rewards: NonAttribute<FurnitureCrackableRewardModel[]>;
}

export function initializeFurnitureCrackableModel(sequelize: Sequelize) {
    FurnitureCrackableModel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true
            },
            requiredClicks: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            tableName: "furniture_crackables",
            sequelize
        }
    );

    FurnitureModel.hasOne(FurnitureCrackableModel, {
        as: "crackable",
        foreignKey: "furnitureId",
    });

    FurnitureCrackableModel.belongsTo(FurnitureModel, {
        as: "furniture",
        foreignKey: "furnitureId",
    });

    FurnitureCrackableModel.hasMany(FurnitureCrackableRewardModel, {
        as: "rewards",
        foreignKey: "crackableId",
    });

    FurnitureCrackableRewardModel.belongsTo(FurnitureCrackableModel, {
        as: "crackable",
        foreignKey: "crackableId",
    });
}

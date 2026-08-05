import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { FurnitureModel } from "../FurnitureModel";

export class FurnitureCrackableRewardModel extends Model {
    declare id: string;
    declare chance: number;

    declare furniture: NonAttribute<FurnitureModel>;
}

export function initializeFurnitureCrackableRewardModel(sequelize: Sequelize) {
    FurnitureCrackableRewardModel.init(
        {
          id: {
            type: DataTypes.UUID,
            primaryKey: true
          },
          chance: {
            type: DataTypes.INTEGER,
            allowNull: false
          }
        },
        {
          tableName: "furniture_crackable_rewards",
          sequelize
        }
    );
            
    FurnitureCrackableRewardModel.belongsTo(FurnitureModel, {
        as: "furniture",
        foreignKey: "furnitureId"
    });
}

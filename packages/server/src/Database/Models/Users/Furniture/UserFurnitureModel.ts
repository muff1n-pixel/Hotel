import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { FurnitureModel } from "../../Furniture/FurnitureModel.js";
import { UserModel } from "../UserModel.js";

export class UserFurnitureModel extends Model {
    declare id: string;
    declare quantity: number;
    
    declare furniture: NonAttribute<FurnitureModel>;
}

export function initializeUserFurnitureModel(sequelize: Sequelize) {
    UserFurnitureModel.init(
        {
          id: {
            type: DataTypes.UUID,
            primaryKey: true
          },
          quantity: {
            type: DataTypes.NUMBER,
            defaultValue: 1,
            allowNull: false
          }
        },
        {
          tableName: "user_furniture",
          sequelize
        }
    );

    UserFurnitureModel.belongsTo(FurnitureModel, {
        as: "furniture",
        foreignKey: "furnitureId"
    });

    UserFurnitureModel.belongsTo(UserModel, {
        as: "user",
        foreignKey: "userId"
    });
    
    UserModel.hasMany(UserFurnitureModel, {
        as: "userFurniture",
        foreignKey: "userFurnitureId"
    });
}

import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { Furniture } from "../../Furniture/Furniture.js";
import { User } from "../User.js";

export class UserFurniture extends Model {
    declare id: string;
    declare quantity: number;
    
    declare furniture: NonAttribute<Furniture>;
}

export function initializeUserFurnitureModel(sequelize: Sequelize) {
    UserFurniture.init(
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

    UserFurniture.belongsTo(Furniture, {
        as: "furniture",
        foreignKey: "furnitureId"
    });

    UserFurniture.belongsTo(User, {
        as: "user",
        foreignKey: "userId"
    });
    
    User.hasMany(UserFurniture, {
        as: "userFurniture",
        foreignKey: "userFurnitureId"
    });
}

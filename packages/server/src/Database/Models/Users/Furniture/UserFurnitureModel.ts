import { DataTypes, Model, Sequelize } from "sequelize";
import { RoomPosition } from "@shared/Interfaces/Room/RoomPosition.js";
import { NonAttribute } from "@sequelize/core";
import { FurnitureModel } from "../../Furniture/FurnitureModel.js";
import { RoomModel } from "../../Rooms/RoomModel.js";
import { UserModel } from "../UserModel.js";

export class UserFurnitureModel<T = unknown> extends Model {
    declare id: string;
    declare position: RoomPosition;
    declare direction: number;
    declare animation: number;
    declare color: number | null;
    declare data: T | null;
    declare hidden: boolean;

    declare room: NonAttribute<RoomModel | null>;
    declare user: NonAttribute<UserModel>;
    declare furniture: NonAttribute<FurnitureModel>;
}

export function initializeUserFurnitureModel(sequelize: Sequelize) {
    UserFurnitureModel.init(
        {
          id: {
            type: DataTypes.UUID,
            primaryKey: true,
          },
          position: {
              type: DataTypes.TEXT,
              get: function () {
                  return JSON.parse(this.getDataValue("position"));
              },
              set: function (value) {
                  this.setDataValue("position", JSON.stringify(value));
              },
              allowNull: true,
              defaultValue: null
          },
          direction: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
          },
          animation: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
          },
          color: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
          },
          data: {
              type: DataTypes.TEXT,
              get: function () {
                  return JSON.parse(this.getDataValue("data"));
              },
              set: function (value) {
                  this.setDataValue("data", JSON.stringify(value));
              },
              allowNull: true
          }
        },
        {
          tableName: 'user_furnitures',
          sequelize
        },
      );
    
    UserFurnitureModel.belongsTo(FurnitureModel, {
        as: "furniture",
        foreignKey: "furnitureId"
    });

    UserFurnitureModel.belongsTo(UserModel, {
        as: "user",
        foreignKey: "userId"
    });

    UserFurnitureModel.belongsTo(RoomModel, {
        as: "room",
        foreignKey: "roomId",
        constraints: false
    });
    
    RoomModel.hasMany(UserFurnitureModel, {
        as: "roomFurnitures",
        foreignKey: "roomId",
        constraints: false
    });
}

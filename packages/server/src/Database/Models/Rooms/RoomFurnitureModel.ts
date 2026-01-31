import { DataTypes, Model, Sequelize } from "sequelize";
import { RoomPosition } from "@shared/Interfaces/Room/RoomPosition.js";
import { NonAttribute } from "@sequelize/core";
import { FurnitureModel } from "../Furniture/FurnitureModel.js";
import { RoomModel } from "./RoomModel.js";
import { UserModel } from "../Users/UserModel.js";

export class RoomFurnitureModel extends Model {
    declare id: string;
    declare position: RoomPosition;
    declare direction: number;
    declare animation: number;
    declare data: unknown;

    declare user: NonAttribute<UserModel>;
    declare furniture: NonAttribute<FurnitureModel>;
}

export function initializeRoomFurnitureModel(sequelize: Sequelize) {
    RoomFurnitureModel.init(
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
              allowNull: false
          },
          direction: {
            type: DataTypes.NUMBER,
            allowNull: false,
          },
          animation: {
            type: DataTypes.NUMBER,
            defaultValue: 0,
          },
          color: {
            type: DataTypes.NUMBER,
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
          },
        },
        {
          tableName: 'room_furnitures',
          sequelize
        },
      );
    
    RoomFurnitureModel.belongsTo(FurnitureModel, {
        as: "furniture",
        foreignKey: "furnitureId"
    });

    RoomFurnitureModel.belongsTo(UserModel, {
        as: "user",
        foreignKey: "userId"
    });
    
    RoomModel.hasMany(RoomFurnitureModel, {
        as: "roomFurnitures",
        foreignKey: "roomId"
    });
}

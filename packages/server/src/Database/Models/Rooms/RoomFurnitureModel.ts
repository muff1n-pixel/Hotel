import { DataTypes, Model, Sequelize } from "sequelize";
import { RoomPosition } from "@shared/Interfaces/Room/RoomPosition.js";
import { NonAttribute } from "@sequelize/core";
import { FurnitureModel } from "../Furniture/FurnitureModel.js";
import { RoomModel } from "./RoomModel.js";

export class RoomFurnitureModel extends Model {
    declare id: string;
    declare position: RoomPosition;
    declare direction: number;
    declare animation: number;

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
    
    RoomModel.hasMany(RoomFurnitureModel, {
        as: "roomFurnitures",
        foreignKey: "roomId"
    });
}

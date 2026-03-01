import { DataTypes, Model, Sequelize } from "sequelize";
import { RoomPosition } from "@shared/Interfaces/Room/RoomPosition.js";
import { FurnitureFlagsData } from "@shared/Interfaces/Furniture/FurnitureFlags";

export class FurnitureModel extends Model {
    declare id: string;
    declare type: string;
    declare name: string;
    declare description?: string;
    declare placement: "floor" | "wall";
    declare dimensions: RoomPosition;
    declare interactionType: string;
    declare color?: number;
    declare category: string;
    declare flags: FurnitureFlagsData;
    declare customParams: any[] | null;
}

export function initializeFurnitureModel(sequelize: Sequelize) {
    FurnitureModel.init(
        {
          id: {
            type: DataTypes.UUID,
            primaryKey: true
          },
          type: {
            type: new DataTypes.STRING(64),
            allowNull: false
          },
          name: {
            type: new DataTypes.STRING(256),
            allowNull: false
          },
          description: {
            type: new DataTypes.STRING(256),
            allowNull: true,
            defaultValue: null
          },
          category: {
            type: new DataTypes.STRING(32),
            allowNull: false
          },
          interactionType: {
            type: new DataTypes.STRING(32),
            allowNull: false,
            defaultValue: "default"
          },
          placement: {
            type: new DataTypes.STRING(32),
            allowNull: false
          },
          dimensions: {
              type: DataTypes.TEXT,
              get: function () {
                  return JSON.parse(this.getDataValue("dimensions"));
              },
              set: function (value) {
                  this.setDataValue("dimensions", JSON.stringify(value));
              },
              allowNull: false
          },
          color: {
            type: DataTypes.INTEGER,
            defaultValue: null
          },
          flags: {
              type: DataTypes.TEXT,
              get: function () {
                  return JSON.parse(this.getDataValue("flags"));
              },
              set: function (value) {
                  this.setDataValue("flags", JSON.stringify(value));
              },
              allowNull: false
          },
          customParams: {
              type: DataTypes.TEXT,
              get: function () {
                  return JSON.parse(this.getDataValue("customParams"));
              },
              set: function (value) {
                  this.setDataValue("customParams", JSON.stringify(value));
              },
              allowNull: true,
              defaultValue: null
          }
        },
        {
          tableName: "furnitures",
          sequelize,
          
          indexes: [
            {
              unique: true,
              fields: ['type', 'color']
            }
          ],
        }
    );
}

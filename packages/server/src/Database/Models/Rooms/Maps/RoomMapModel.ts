import { RoomStructureDoorData } from "@pixel63/events";
import { DataTypes, Model, Sequelize } from "sequelize";

export class RoomMapModel extends Model {
    declare id: string;
    declare grid: string[];
    declare door: RoomStructureDoorData;
}

export function initializeRoomMapModel(sequelize: Sequelize) {
    RoomMapModel.init(
        {
          id: {
            type: DataTypes.STRING,
            primaryKey: true,
          },
          door: {
              type: DataTypes.TEXT,
              get: function () {
                  return JSON.parse(this.getDataValue("door"));
              },
              set: function (value) {
                  this.setDataValue("door", JSON.stringify(value));
              },
              allowNull: false
          },
          grid: {
              type: DataTypes.TEXT,
              get: function () {
                  return JSON.parse(this.getDataValue("grid"));
              },
              set: function (value: string[]) {
                  this.setDataValue("grid", JSON.stringify(value.map((row) => row.toUpperCase())));
              },
              allowNull: false
          },
          index: {
            type: DataTypes.INTEGER,
            defaultValue: 0
          },
          indexable: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
          }
        },
        {
          tableName: 'room_models',
          sequelize,
        },
    );
}

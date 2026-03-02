import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { UserFurnitureModel } from "../Users/Furniture/UserFurnitureModel.js";
import { UserModel } from "../Users/UserModel.js";
import { RoomRightsModel } from "./Rights/RoomRightsModel.js";
import { RoomCategoryModel } from "./Categories/RoomCategoryModel.js";
import { UserBotModel } from "../Users/Bots/UserBotModel.js";
import { RoomStructureData } from "@pixel63/events";

export class RoomModel extends Model {
    declare id: string;
    declare type: string;
    
    declare name: string;
    declare description: string;
    declare category: NonAttribute<RoomCategoryModel>;

    declare owner: NonAttribute<UserModel>;

    declare structure: Required<RoomStructureData>;
    
    declare thumbnail: string | null;
    declare maxUsers: number;
    declare speed: number;
    
    declare rights: NonAttribute<RoomRightsModel[]>;
    declare roomFurnitures: NonAttribute<UserFurnitureModel[]>;
    declare roomBots: NonAttribute<UserBotModel[]>;
}

export function initializeRoomModel(sequelize: Sequelize) {
    RoomModel.init(
        {
          id: {
            type: DataTypes.UUID,
            primaryKey: true,
          },
          type: {
            type: DataTypes.STRING,
            defaultValue: "private",
            allowNull: false
          },
          name: {
            type: new DataTypes.STRING(32),
            allowNull: false,
          },
          description: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null
          },
          thumbnail: {
            type: new DataTypes.BLOB("medium"),
            allowNull: true,
            defaultValue: null
          },
          maxUsers: {
            type: new DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 10
          },
          structure: {
              type: DataTypes.TEXT,
              get: function () {
                  return JSON.parse(this.getDataValue("structure"));
              },
              set: function (value: RoomStructureData) {
                  this.setDataValue("structure", JSON.stringify({
                    ...value,
                    grid: value.grid.map((row) => row.toUpperCase())
                  }));
              },
              allowNull: false
          },
          speed: {
            type: DataTypes.FLOAT,
            defaultValue: 1,
            allowNull: false,
          }
        },
        {
          tableName: 'rooms',
          sequelize,
        },
    );
    
    RoomModel.belongsTo(UserModel, {
        as: "owner",
        foreignKey: "ownerId"
    });
    
    RoomModel.belongsTo(RoomCategoryModel, {
        as: "category",
        foreignKey: "categoryId",
        constraints: false
    });
}

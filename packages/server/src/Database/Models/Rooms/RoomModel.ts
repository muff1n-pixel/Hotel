import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { RoomStructure } from "@shared/Interfaces/Room/RoomStructure.js";
import { UserFurnitureModel } from "../Users/Furniture/UserFurnitureModel.js";
import { RoomMoodlightData } from "@shared/Interfaces/Room/RoomMoodlightData.js";
import { UserModel } from "../Users/UserModel.js";
import { RoomRightsModel } from "./Rights/RoomRightsModel.js";
import { RoomCategoryModel } from "./Categories/RoomCategoryModel.js";
import { RoomType } from "@shared/Interfaces/Room/RoomType.js";
import { UserBotModel } from "../Users/Bots/UserBotModel.js";

export class RoomModel extends Model {
    declare id: string;
    declare type: RoomType;
    
    declare name: string;
    declare description: string;
    declare category: NonAttribute<RoomCategoryModel>;

    declare owner: NonAttribute<UserModel>;

    declare structure: RoomStructure;
    
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
              set: function (value: RoomStructure) {
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

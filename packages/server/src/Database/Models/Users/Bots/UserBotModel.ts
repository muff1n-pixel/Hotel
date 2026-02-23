import { DataTypes, Model, Sequelize } from "sequelize";
import { RoomPosition } from "@shared/Interfaces/Room/RoomPosition.js";
import { NonAttribute } from "@sequelize/core";
import { RoomModel } from "../../Rooms/RoomModel.js";
import { UserModel } from "../UserModel.js";
import { BotTypeData } from "@shared/Interfaces/Bots/BotTypeData.js";
import { FigureConfiguration } from "@shared/Interfaces/Figure/FigureConfiguration.js";

export class UserBotModel extends Model {
    declare id: string;
    
    declare name: string;
    declare motto: string | null;
    declare type: BotTypeData;

    declare figureConfiguration: FigureConfiguration;

    declare position: RoomPosition;
    declare direction: number;

    declare room: NonAttribute<RoomModel | null>;
    declare user: NonAttribute<UserModel>;
    declare userId: NonAttribute<string>;
}

export function initializeUserBotModel(sequelize: Sequelize) {
    UserBotModel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },

            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            motto: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null
            },

            type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            
            figureConfiguration: {
                type: DataTypes.TEXT,
                get: function () {
                    return JSON.parse(this.getDataValue("figureConfiguration"));
                },
                set: function (value) {
                    this.setDataValue("figureConfiguration", JSON.stringify(value));
                },
                allowNull: false
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
        },
        {
          tableName: 'user_bots',
          sequelize
        },
      );

    UserBotModel.belongsTo(UserModel, {
        as: "user",
        foreignKey: "userId"
    });

    UserBotModel.belongsTo(RoomModel, {
        as: "room",
        foreignKey: "roomId",
        constraints: false
    });
    
    RoomModel.hasMany(UserBotModel, {
        as: "roomBots",
        foreignKey: "roomId",
        constraints: false
    });
}

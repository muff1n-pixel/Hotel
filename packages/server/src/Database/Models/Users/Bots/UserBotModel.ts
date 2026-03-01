import { DataTypes, Model, Sequelize } from "sequelize";
import { NonAttribute } from "@sequelize/core";
import { RoomModel } from "../../Rooms/RoomModel.js";
import { UserModel } from "../UserModel.js";
import { BotSpeechData, FigureConfigurationData, RoomPositionData } from "@pixel63/events";

export class UserBotModel extends Model {
    declare id: string;
    
    declare name: string;
    declare motto: string | null;
    declare type: string;

    declare figureConfiguration: FigureConfigurationData;

    declare position: RoomPositionData;
    declare direction: number;
    declare speech: BotSpeechData;
    declare relaxed: boolean;

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
            
            speech: {
                type: DataTypes.TEXT,
                get: function () {
                    return JSON.parse(this.getDataValue("speech"));
                },
                set: function (value) {
                    this.setDataValue("speech", JSON.stringify(value));
                },
                allowNull: false,
                defaultValue: JSON.stringify({
                    $type: "BotSpeechData",
                    automaticChat: false,
                    automaticChatDelay: 30,
                    messages: [],
                    randomizeMessages: true
                } satisfies BotSpeechData)
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

            relaxed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
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

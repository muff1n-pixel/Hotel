import { DataTypes, Model, Sequelize } from "sequelize";
import { NonAttribute } from "@sequelize/core";
import { FurnitureModel } from "../../Furniture/FurnitureModel.js";
import { RoomModel } from "../../Rooms/RoomModel.js";
import { UserModel } from "../UserModel.js";
import { RoomPositionData, UserFurnitureAnimationTag, UserFurnitureCustomData } from "@pixel63/events";

export class UserFurnitureModel extends Model {
    declare id: string;
    declare position: RoomPositionData;
    declare direction: number | null;

    declare name?: string;
    declare description?: string;

    declare animation: number;
    declare animationTags?: UserFurnitureAnimationTag[] | null;

    declare color: number | null;
    declare data?: UserFurnitureCustomData;
    declare hidden: boolean;

    declare room: NonAttribute<RoomModel | null>;
    declare roomId?: NonAttribute<string>;

    declare user?: NonAttribute<UserModel>;
    declare userId?: NonAttribute<string>;

    declare furniture: NonAttribute<FurnitureModel>;
    declare furnitureId: NonAttribute<string>;

    declare trax: NonAttribute<UserFurnitureModel | null>;
    declare traxId: NonAttribute<string | null>;
}

export function initializeUserFurnitureModel(sequelize: Sequelize) {
    UserFurnitureModel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            
            name: {
                type: new DataTypes.STRING(256),
                allowNull: true,
                defaultValue: null
            },

            description: {
                type: new DataTypes.STRING(256),
                allowNull: true,
                defaultValue: null
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
            animationTags: {
                type: DataTypes.TEXT,
                get: function () {
                    return JSON.parse(this.getDataValue("animationTags"));
                },
                set: function (value) {
                    this.setDataValue("animationTags", JSON.stringify(value));
                },
                allowNull: true,
                defaultValue: null
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
        foreignKey: "userId",
        constraints: false
    });

    UserFurnitureModel.belongsTo(RoomModel, {
        as: "room",
        foreignKey: "roomId",
        constraints: false
    });

    UserFurnitureModel.belongsTo(UserFurnitureModel, {
        as: "trax",
        foreignKey: "traxId"
    });

    RoomModel.hasMany(UserFurnitureModel, {
        as: "roomFurnitures",
        foreignKey: "roomId",
        constraints: false
    });
}

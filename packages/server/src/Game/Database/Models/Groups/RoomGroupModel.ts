import { GroupBadgeData } from "@pixel63/events";
import { DataTypes, Model, Sequelize } from "sequelize";
import { UserModel } from "../Users/UserModel";

export enum GroupType {
    PUBLIC = "public",
    PRIVATE = "private",
    EXCLUSIVE = "exclusive"
};

export enum GroupRights {
    OWNER = "owner",
    ADMINS = "admins",
    MEMBERS = "members"
};

export class GroupModel extends Model {
    declare id: string;

    declare name: string;
    declare description: string;

    declare primaryColor: string;
    declare secondaryColor: string;

    declare type: GroupType;
    declare rights: GroupRights;

    declare badge: GroupBadgeData;
}

export function initializeGroupModel(sequelize: Sequelize) {
    GroupModel.init(
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false
            },
            primaryColor: {
                type: DataTypes.STRING,
                allowNull: false
            },
            secondaryColor: {
                type: DataTypes.STRING,
                allowNull: false
            },
            badge: {
                type: DataTypes.TEXT,
                get: function () {
                    return JSON.parse(this.getDataValue("badge"));
                },
                set: function (value) {
                    this.setDataValue("badge", JSON.stringify(value));
                },
                allowNull: false
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: GroupType.PUBLIC
            },
            rights: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: GroupRights.OWNER
            }
        },
        {
            tableName: 'room_groups',
            sequelize,
        },
    );
}

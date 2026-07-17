import { GroupBadgeData } from "@pixel63/events";
import { DataTypes, Model, Sequelize } from "sequelize";

export class RoomGroupModel extends Model {
    declare id: string;

    declare name: string;
    declare description: string;

    declare primaryColor: string;
    declare secondaryColor: string;

    declare badge: GroupBadgeData;
}

export function initializeRoomGroupModel(sequelize: Sequelize) {
    RoomGroupModel.init(
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
            }
        },
        {
            tableName: 'room_groups',
            sequelize,
        },
    );
}

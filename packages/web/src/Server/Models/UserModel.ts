import { DataTypes, Model, Sequelize } from "sequelize";

export class UserModel extends Model {
    declare id: string;
    declare name: string;
    declare password: string;
    declare figureConfiguration: any;
    declare credits: number;
    declare diamonds: number;
    declare duckets: number;
    declare motto: string;
    declare homeRoomId: string | null;
    declare roomChatStyleId: string;
}

export function initializeUserModel(sequelize: Sequelize) {
    UserModel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            name: {
                type: new DataTypes.STRING(32),
                allowNull: false,
            },
            password: {
                type: new DataTypes.STRING(256),
                allowNull: true,
                defaultValue: null
            },
            credits: {
                type: new DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 5200
            },
            diamonds: {
                type: new DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1000
            },
            duckets: {
                type: new DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 10000
            },
            motto: {
                type: new DataTypes.STRING(40),
                allowNull: false,
                defaultValue: "I am new to Pixel63!"
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
            homeRoomId: {
                type: DataTypes.TEXT,
                allowNull: true,
                defaultValue: null
            },
            roomChatStyleId: {
                type: DataTypes.TEXT,
                allowNull: false,
                defaultValue: "normal"
            }
        },
        {
            tableName: 'users',
            sequelize
        },
    );
}

import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { UserModel } from "../Users/UserModel.js";

export class RoomModel extends Model {
    declare id: string;
    declare type: string;
    declare name: string;
    declare description: string;
    declare owner: NonAttribute<UserModel>;
    declare thumbnail: string | null;
    declare currentUsers: number;
    declare maxUsers: number;
}

export function initialize(sequelize: Sequelize) {
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
          currentUsers: {
            type: new DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
          },
          maxUsers: {
            type: new DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 10
          }
        },
        {
          tableName: 'rooms',
          sequelize,
        },
    );
}

export function associate() {
    RoomModel.belongsTo(UserModel, {
        as: "owner",
        foreignKey: "ownerId"
    });
}
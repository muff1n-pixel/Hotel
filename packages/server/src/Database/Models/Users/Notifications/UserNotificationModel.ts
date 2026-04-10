import { DataTypes, Model, Sequelize } from "sequelize";
import { NonAttribute } from "@sequelize/core";
import { UserModel } from "../UserModel.js";

export class UserNotificationModel extends Model {
    declare id: string;
    declare type: string;
    declare count: number;

    declare user: NonAttribute<UserModel>;
}

export function initializeUserNotificationModel(sequelize: Sequelize) {
    UserNotificationModel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false
            },
            count: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            }
        },
        {
            tableName: 'user_notifications',
            sequelize,
            indexes: [
                {
                    unique: true,
                    fields: ["userId", "type"],
                },
            ],
        },
    );

    UserNotificationModel.belongsTo(UserModel, {
        as: "user",
        foreignKey: "userId"
    });
}

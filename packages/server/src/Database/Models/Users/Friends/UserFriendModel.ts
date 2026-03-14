import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { UserModel } from "../UserModel.js";

export class UserFriendModel extends Model {
    declare id: string;

    declare user: NonAttribute<UserModel>;
    declare friend: NonAttribute<UserModel>;
}

export function initializeUserFriendModel(sequelize: Sequelize) {
    UserFriendModel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
        },
        {
            tableName: 'user_friends',
            sequelize
        },
    );

    UserFriendModel.belongsTo(UserModel, {
        as: "user",
        foreignKey: "userId"
    });

    UserFriendModel.belongsTo(UserModel, {
        as: "friend",
        foreignKey: "friendId"
    });
}

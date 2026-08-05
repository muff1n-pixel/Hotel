import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { UserModel } from "../UserModel.js";

export class UserFriendRequestModel extends Model {
    declare id: string;

    declare sender: NonAttribute<UserModel>;
    declare receiver: NonAttribute<UserModel>;
}

export function initializeUserFriendRequestModel(sequelize: Sequelize) {
    UserFriendRequestModel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
        },
        {
            tableName: 'user_friend_requests',
            sequelize
        },
    );

    UserFriendRequestModel.belongsTo(UserModel, {
        as: "sender",
        foreignKey: "senderId"
    });

    UserFriendRequestModel.belongsTo(UserModel, {
        as: "receiver",
        foreignKey: "receiverId"
    });
}

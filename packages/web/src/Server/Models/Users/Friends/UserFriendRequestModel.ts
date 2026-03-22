import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { UserModel } from "../UserModel";

export class UserFriendRequestModel extends Model {
    declare id: string;

    declare sender: NonAttribute<UserModel>;
    declare receiver: NonAttribute<UserModel>;
}

export function initialize(sequelize: Sequelize) {
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
}

export function associate() {
    UserFriendRequestModel.belongsTo(UserModel, {
        as: "sender",
        foreignKey: "senderId"
    });

    UserFriendRequestModel.belongsTo(UserModel, {
        as: "receiver",
        foreignKey: "receiverId"
    });
}
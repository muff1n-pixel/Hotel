import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { UserModel } from "../UserModel";

export class UserFriendModel extends Model {
    declare id: string;

    declare user: NonAttribute<UserModel>;
    declare friend: NonAttribute<UserModel>;
}

export function initialize(sequelize: Sequelize) {
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
}

export function associate() {
    UserFriendModel.belongsTo(UserModel, {
        as: "user",
        foreignKey: "userId"
    });

    UserFriendModel.belongsTo(UserModel, {
        as: "friend",
        foreignKey: "friendId"
    });
}
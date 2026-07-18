import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { UserModel } from "../UserModel";
import { GroupModel } from "../../Groups/RoomGroupModel";

export class UserGroupModel extends Model {
    declare userId: string;
    declare groupId: string;

    declare owner: boolean;
    declare admin: boolean;

    declare createdAt: string;

    declare user: NonAttribute<UserModel>;
}

export function initializeUserGroupModel(sequelize: Sequelize) {
    UserGroupModel.init(
        {
            userId: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            groupId: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            owner: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            admin: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        },
        {
            tableName: 'user_groups',
            sequelize,
        },
    );

    UserModel.belongsToMany(GroupModel, {
        through: UserGroupModel,
        as: "groups",
        foreignKey: "userId",
        otherKey: "groupId",
    });

    GroupModel.belongsToMany(UserModel, {
        through: UserGroupModel,
        as: "users",
        foreignKey: "groupId",
        otherKey: "userId",
    });
}

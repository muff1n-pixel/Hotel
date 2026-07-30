import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { UserModel } from "../UserModel";
import { GroupModel } from "../../Groups/RoomGroupModel";

export class UserGroupModel extends Model {
    declare userId: string;
    declare groupId: string;

    declare owner: boolean;
    declare admin: boolean;

    declare pending: boolean;
    declare favourite: boolean;

    declare createdAt: NonAttribute<Date>;

    declare user: NonAttribute<UserModel>;
    declare group: NonAttribute<GroupModel>;
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
            pending: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            favourite: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
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
    
    UserGroupModel.belongsTo(UserModel, {
        as: "user",
        foreignKey: "userId"
    });
    
    UserGroupModel.belongsTo(GroupModel, {
        as: "group",
        foreignKey: "groupId"
    });

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

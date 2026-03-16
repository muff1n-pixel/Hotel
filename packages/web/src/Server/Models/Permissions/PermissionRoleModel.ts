import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { PermissionModel } from "./PermissionModel.js";
import { UserModel } from "../Users/UserModel.js";

export class PermissionRoleModel extends Model {
    declare id: string;
    declare permissions: NonAttribute<PermissionModel[]>;
    declare name: string;
    declare description: string;
}

export function initialize(sequelize: Sequelize) {
    PermissionRoleModel.init({
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        }
    }, {
        sequelize,
        tableName: "permission_roles"
    });
}

export function associate() {
    UserModel.belongsToMany(PermissionRoleModel, {
        through: "user_roles",
        as: "roles",
        foreignKey: "userId"
    });

    PermissionRoleModel.belongsToMany(UserModel, {
        through: "user_roles",
        foreignKey: "roleId"
    });

    PermissionRoleModel.belongsToMany(PermissionModel, {
        through: "role_permissions",
        as: "permissions",
        foreignKey: "roleId"
    });

    PermissionModel.belongsToMany(PermissionRoleModel, {
        through: "role_permissions",
        foreignKey: "permissionId"
    });
}
import { PermissionAction } from "@shared/Interfaces/Permissions/PermissionMap";
import { DataTypes, Model, Sequelize } from "sequelize";

export class PermissionModel extends Model {
    declare id: PermissionAction;
    declare name: string;
    declare description: string;
}

export function initialize(sequelize: Sequelize) {
    PermissionModel.init({
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
        tableName: "permissions"
    });
}

import { PermissionAction } from "@shared/Interfaces/Permissions/PermissionMap";
import { DataTypes, Model, Sequelize } from "sequelize";

export class PermissionModel extends Model {
    declare id: PermissionAction;
}

export function intitializePermissionModel(sequelize: Sequelize) {
    PermissionModel.init({
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        }
    }, {
        sequelize,
        tableName: "permissions"
    });
}

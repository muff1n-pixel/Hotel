import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { RankModel } from "./RankModel";
import { PermissionModel } from "../Permissions/PermissionModel";

export class RankPermissionModel extends Model {
    declare id: string;
    declare rank: NonAttribute<RankModel>;
    declare role: NonAttribute<PermissionModel>;
}

export function initialize(sequelize: Sequelize) {
    RankPermissionModel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
            }
        },
        {
            tableName: 'rank_permissions',
            sequelize
        },
    );
}

export function associate() {
    RankPermissionModel.belongsTo(RankModel, {
        as: "rank",
        foreignKey: "rankId",
        constraints: true
    });

    RankPermissionModel.belongsTo(PermissionModel, {
        as: "permissions",
        foreignKey: "roleId",
        constraints: true
    });
}
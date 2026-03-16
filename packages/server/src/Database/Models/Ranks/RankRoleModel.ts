import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { RankModel } from "./RankModel";
import { PermissionModel } from "../Permissions/PermissionModel";
import { UserModel } from "../Users/UserModel";
import { PermissionRoleModel } from "../Permissions/PermissionRoleModel";

export class RankRoleModel extends Model {
    declare id: string;
    declare rank: NonAttribute<RankModel>;
    declare role: NonAttribute<PermissionRoleModel>;
}

export function initializeRankRoleModel(sequelize: Sequelize) {
    RankRoleModel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
            }
        },
        {
            tableName: 'rank_roles',
            sequelize
        },
    );

    RankRoleModel.belongsTo(RankModel, {
        as: "rank",
        foreignKey: "rankId",
        constraints: true
    });

    RankRoleModel.belongsTo(PermissionRoleModel, {
        as: "role",
        foreignKey: "roleId",
        constraints: true
    });
}

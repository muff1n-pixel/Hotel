import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { RankModel } from "./RankModel";
import { PermissionRoleModel } from "../Permissions/PermissionRoleModel";

export class RankRoleModel extends Model {
    declare id: string;
    declare rank: NonAttribute<RankModel>;
    declare role: NonAttribute<PermissionRoleModel>;
}

export function initialize(sequelize: Sequelize) {
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
}

export function associate() {
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
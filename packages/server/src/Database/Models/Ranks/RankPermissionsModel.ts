import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { RankModel } from "./RankModel";
import { PermissionModel } from "../Permissions/PermissionModel";
import { UserModel } from "../Users/UserModel";

export class RankPermissionModel extends Model {
    declare id: string;
    declare rank: NonAttribute<RankModel>;
    declare role: NonAttribute<PermissionModel>;
}

export function initializeRankPermissionModel(sequelize: Sequelize) {
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

    RankPermissionModel.belongsTo(RankModel, {
        as: "rank",
        foreignKey: "rankId"
    });

    RankPermissionModel.belongsTo(PermissionModel, {
        as: "permissions",
        foreignKey: "roleId"
    });
}

import { DataTypes, Model, Sequelize } from "sequelize";
import { NonAttribute } from "@sequelize/core";
import { UserModel } from "../UserModel.js";
import { BadgeModel } from "../../Badges/BadgeModel.js";

export class UserBadgeModel extends Model {
    declare id: string;
    declare badge: NonAttribute<BadgeModel>;
    declare equipped: boolean;

    declare user: NonAttribute<UserModel>;
}

export function initializeUserBadgeModel(sequelize: Sequelize) {
    UserBadgeModel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            equipped: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
        },
        {
            tableName: 'user_badges',
            sequelize
        },
    );

    UserBadgeModel.belongsTo(UserModel, {
        as: "user",
        foreignKey: "userId",
        constraints: false
    });

    UserBadgeModel.belongsTo(BadgeModel, {
        as: "badge",
        foreignKey: "badgeId",
        constraints: false
    });
}

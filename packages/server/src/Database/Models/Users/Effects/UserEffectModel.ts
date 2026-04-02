import { DataTypes, Model, Sequelize } from "sequelize";
import { NonAttribute } from "@sequelize/core";
import { UserModel } from "../UserModel.js";

export class UserEffectModel extends Model {
    declare id: string;
    declare enable: number;

    declare user: NonAttribute<UserModel>;
}

export function initializeUserEffectModel(sequelize: Sequelize) {
    UserEffectModel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            enable: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
        },
        {
            tableName: 'user_effects',
            sequelize,
            indexes: [
                {
                    unique: true,
                    fields: ["userId", "enable"],
                },
            ],
        },
    );

    UserEffectModel.belongsTo(UserModel, {
        as: "user",
        foreignKey: "userId"
    });
}

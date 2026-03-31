import { DataTypes, Model, Sequelize } from "sequelize";
import { NonAttribute } from "@sequelize/core";
import { UserModel } from "../UserModel.js";

export class UserClothingModel extends Model {
    declare id: string;
    declare setId: string;

    declare user: NonAttribute<UserModel>;
}

export function initializeUserClothingModel(sequelize: Sequelize) {
    UserClothingModel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            setId: {
                type: DataTypes.STRING,
                allowNull: false
            },
        },
        {
            tableName: 'user_clothing',
            sequelize,
            indexes: [
                {
                    unique: true,
                    fields: ["userId", "setId"],
                },
            ],
        },
    );

    UserClothingModel.belongsTo(UserModel, {
        as: "user",
        foreignKey: "userId"
    });
}

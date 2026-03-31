import { DataTypes, Model, Sequelize } from "sequelize";
import { NonAttribute } from "@sequelize/core";
import { UserModel } from "../UserModel.js";

export class UserClothesModel extends Model {
    declare id: string;
    declare part: number;

    declare user: NonAttribute<UserModel>;
}

export function initializeUserClothesModel(sequelize: Sequelize) {
    UserClothesModel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            part: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
        },
        {
            tableName: 'user_clothes',
            sequelize,
            indexes: [
                {
                    unique: true,
                    fields: ["userId", "part"],
                },
            ],
        },
    );

    UserClothesModel.belongsTo(UserModel, {
        as: "user",
        foreignKey: "userId"
    });
}

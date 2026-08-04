import { DataTypes, Model, Sequelize } from "sequelize";
import { NonAttribute } from "@sequelize/core";
import { UserModel } from "../UserModel.js";
import { FigureConfigurationData } from "@pixel63/events";

export class UserFigureModel extends Model {
    declare id: string;
    declare index: number;
    declare figureConfiguration: FigureConfigurationData;

    declare user: NonAttribute<UserModel>;
}

export function initializeUserFigureModel(sequelize: Sequelize) {
    UserFigureModel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            index: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            figureConfiguration: {
                type: DataTypes.TEXT,
                get: function () {
                    return JSON.parse(this.getDataValue("figureConfiguration"));
                },
                set: function (value) {
                    this.setDataValue("figureConfiguration", JSON.stringify(value));
                },
                allowNull: false
            },
        },
        {
            tableName: 'user_figures',
            sequelize,
            indexes: [
                {
                    unique: true,
                    fields: ["userId", "index"],
                },
            ],
        },
    );

    UserFigureModel.belongsTo(UserModel, {
        as: "user",
        foreignKey: "userId"
    });
}

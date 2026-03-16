import { DataTypes, Model, Sequelize } from "sequelize";

export class RankModel extends Model {
    declare id: string;
    declare name: string;
    declare description: string;
    declare priorityOrder: number;
}

export function initialize(sequelize: Sequelize) {
    RankModel.init({
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        priorityOrder: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    },
        {
            tableName: 'ranks',
            sequelize
        });
}

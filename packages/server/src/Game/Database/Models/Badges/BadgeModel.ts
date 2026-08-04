import { DataTypes, Model, Sequelize } from "sequelize";

export class BadgeModel extends Model {
    declare id: string;
    declare name: string | null;
    declare description: string | null;
    declare image: string;
}

export function initializeBadgeModel(sequelize: Sequelize) {
    BadgeModel.init(
        {
            id: {
                type: new DataTypes.STRING(32),
                primaryKey: true
            },
            name: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            image: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            tableName: 'badges',
            sequelize
        },
    );
}

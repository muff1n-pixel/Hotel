import { DataTypes, Model, Sequelize } from "sequelize";

export class ServerStatsModel extends Model {
    declare id: string;
    declare onlines: number;
}

export function initializeServerStatsModel(sequelize: Sequelize) {
    ServerStatsModel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            onlines: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false
            },
        },
        {
            tableName: 'server_stats',
            sequelize
        },
    );
}

import { DataTypes, Model, Sequelize } from "sequelize";

export class ServerTokenModel extends Model {
    declare id: string;
    declare secretKey: string;
}

export function initializeServerTokenModel(sequelize: Sequelize) {
    ServerTokenModel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            secretKey: {
                type: DataTypes.TEXT,
                allowNull: false,
                defaultValue: null
            },
        },
        {
            tableName: 'server_tokens',
            sequelize
        },
    );
}

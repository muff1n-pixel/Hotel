import { DataTypes, Model, Sequelize } from "sequelize";

export class UserTokenModel extends Model {
    declare id: string;
    declare secretKey: string;
}

export function initializeUserTokenModel(sequelize: Sequelize) {
    UserTokenModel.init(
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
            tableName: 'user_tokens',
            sequelize
        },
    );
}

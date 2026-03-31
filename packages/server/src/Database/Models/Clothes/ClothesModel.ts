import { DataTypes, Model, Sequelize } from "sequelize";

export class ClothingModel extends Model {
    declare id: string;
    declare part: string;
    declare setId: string;
}

export function initializeClothingModel(sequelize: Sequelize) {
    ClothingModel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            part: {
                type: DataTypes.STRING,
                allowNull: false
            },
            setId: {
                type: DataTypes.STRING,
                allowNull: false
            },
        },
        {
            tableName: 'clothes',
            sequelize,
            indexes: [
                {
                    unique: true,
                    fields: ["part", "setId"],
                },
            ],
        },
    );
}

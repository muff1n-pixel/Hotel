import { DataTypes, Model, Sequelize } from "sequelize";

export class PetBreedModel extends Model {
    declare id: string;

    declare type: string;
    
    declare name: string;
    declare index: number;
}

export function initializePetBreedModel(sequelize: Sequelize) {
    PetBreedModel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true
            },

            type: {
                type: DataTypes.STRING,
            },

            name: {
                type: new DataTypes.STRING(256),
                allowNull: false
            },

            index: {
                type: DataTypes.NUMBER,
                allowNull: false,
                defaultValue: 0
            }
        },
        {
            tableName: "pet_breeds",
            sequelize
        }
    );
}

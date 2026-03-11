import { DataTypes, Model, Sequelize } from "sequelize";

export class PetBreedModel extends Model {
    declare id: string;

    declare name: string;
}

export function initializePetBreedModel(sequelize: Sequelize) {
    PetBreedModel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true
            },

            name: {
                type: new DataTypes.STRING(256),
                allowNull: false
            },
        },
        {
            tableName: "pet_breeds",
            sequelize
        }
    );
}

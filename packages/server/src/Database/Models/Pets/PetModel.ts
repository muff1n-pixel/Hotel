import { FurnitureFlagsData, PetPaletteData, RoomPositionData } from "@pixel63/events";
import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { PetBreedModel } from "./PetBreedModel";

export class PetModel extends Model {
    declare id: string;

    declare type: string;

    declare name: string;

    declare palettes: PetPaletteData[];

    declare breed?: NonAttribute<PetBreedModel>;
}

export function initializePetModel(sequelize: Sequelize) {
    PetModel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true
            },

            type: {
                type: new DataTypes.STRING(64),
                allowNull: false
            },

            name: {
                type: new DataTypes.STRING(256),
                allowNull: false
            },

            palettes: {
                type: DataTypes.TEXT,
                get: function () {
                    return JSON.parse(this.getDataValue("palettes"));
                },
                set: function (value) {
                    this.setDataValue("palettes", JSON.stringify(value));
                },
                allowNull: true,
                defaultValue: null
            },
        },
        {
            tableName: "pets",
            sequelize
        }
    );
        
    PetModel.belongsTo(PetBreedModel, {
        as: "breed",
        foreignKey: "breedId"
    });
}

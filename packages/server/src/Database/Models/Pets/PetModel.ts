import { FurnitureFlagsData, RoomPositionData } from "@pixel63/events";
import { DataTypes, Model, Sequelize } from "sequelize";

export class PetModel extends Model {
    declare id: string;
    declare type: string;
    declare name: string;
    declare description?: string;
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

          description: {
            type: new DataTypes.STRING(256),
            allowNull: true,
            defaultValue: null
          },
        },
        {
          tableName: "pets",
          sequelize
        }
    );
}

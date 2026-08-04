import { DataTypes, Model, Sequelize } from "sequelize";

export class RoomCategoryModel extends Model {
    declare id: string;
    declare title: string;
    declare developer: boolean;
}

export function initializeRoomCategoryModel(sequelize: Sequelize) {
    RoomCategoryModel.init({
          id: {
            type: new DataTypes.STRING(64),
            primaryKey: true,
          },
          title: {
            type: new DataTypes.TEXT,
            allowNull: false
          },
          developer: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
          }
        },
        {
          tableName: 'room_categories',
          sequelize
        },
    );
}

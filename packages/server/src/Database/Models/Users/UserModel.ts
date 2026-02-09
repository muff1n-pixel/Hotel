import { DataTypes, Model, Sequelize } from "sequelize";
import { sequelize } from "../../Database.js";
import { FigureConfiguration } from "@shared/Interfaces/Figure/FigureConfiguration.js";

export class UserModel extends Model {
    declare id: string;
    declare name: string;
    declare developer: boolean;
    declare figureConfiguration: FigureConfiguration;
    declare credits: number;
    declare diamonds: number;
    declare duckets: number;
    declare homeRoomId: string | null;
    declare roomChatStyleId: string;
}

export function initializeUserModel(sequelize: Sequelize) {
  UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(32),
      allowNull: false,
    },
    developer: {
      type: new DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    credits: {
      type: new DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5200
    },
    diamonds: {
      type: new DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    duckets: {
      type: new DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10000
    },
    figureConfiguration: {
        type: DataTypes.TEXT,
        get: function () {
            return JSON.parse(this.getDataValue("figureConfiguration"));
        },
        set: function (value) {
            this.setDataValue("figureConfiguration", JSON.stringify(value));
        },
        allowNull: false
    },
    homeRoomId: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    roomChatStyleId: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "normal"
    }
  },
  {
    tableName: 'users',
    sequelize
  },
);
}

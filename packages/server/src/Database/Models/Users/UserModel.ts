import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../Database.js";
import { FigureConfiguration } from "@shared/Interfaces/figure/FigureConfiguration.js";

export class UserModel extends Model {
    declare id: string;
    declare name: string;
    declare figureConfiguration: FigureConfiguration;
    declare homeRoomId?: string;
}

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
    }
  },
  {
    tableName: 'users',
    sequelize
  },
);

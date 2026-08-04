import { DataTypes, Model, Sequelize } from "sequelize";
import { UserModel } from "../UserModel.js";

export class UserPreferenceModel extends Model {
  declare id: string;
  declare allowFriendsRequest: boolean;
  declare allowFriendsFollow: boolean;
}

export function initializeUserPreferencesModel(sequelize: Sequelize) {
  UserPreferenceModel.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      allowFriendsRequest: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      allowFriendsFollow: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      tableName: 'user_preferences',
      sequelize
    },
  );

  UserPreferenceModel.belongsTo(UserModel, {
    as: "user",
    foreignKey: "userId",
    constraints: false
  });
}

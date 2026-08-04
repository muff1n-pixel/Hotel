import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { UserModel } from "../Users/UserModel.js";

export enum HotelFeedbackStatus {
    CREATED = 0,
};

export class HotelFeedbackModel extends Model {
    declare id: string;
    declare area: string | null;
    declare description: string;
    declare status: HotelFeedbackStatus;
    declare user: NonAttribute<UserModel>;
}

export function initializeHotelFeedbackModel(sequelize: Sequelize) {
    HotelFeedbackModel.init(
        {
          id: {
            type: DataTypes.UUID,
            primaryKey: true
          },
          area: {
            type: new DataTypes.STRING(128),
            allowNull: true
          },
          description: {
            type: new DataTypes.STRING(512),
            allowNull: false
          },
          status: {
            type: new DataTypes.INTEGER,
            defaultValue: HotelFeedbackStatus.CREATED,
            allowNull: false,
          }
        },
        {
          tableName: "hotel_feedback",
          sequelize
        }
    );

    HotelFeedbackModel.belongsTo(UserModel, {
        as: "user",
        foreignKey: "userId"
    });
}

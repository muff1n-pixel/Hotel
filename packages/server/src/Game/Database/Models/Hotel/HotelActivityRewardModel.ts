import { DataTypes, Model, Sequelize } from "sequelize";

export class HotelActivityRewardModel extends Model {
    declare id: string;

    declare interval: number;

    declare credits: number | null;
    declare duckets: number | null;
    declare diamonds: number | null;
}

export function initializeHotelActivityRewardModel(sequelize: Sequelize) {
    HotelActivityRewardModel.init(
        {
          id: {
            type: DataTypes.UUID,
            primaryKey: true
          },
          interval: {
            type: DataTypes.INTEGER,
            allowNull: false
          },
          credits: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
          },
          duckets: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
          },
          diamonds: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
          },
        },
        {
          tableName: "hotel_activity_rewards",
          sequelize
        }
    );
}

import { DataTypes, Model, Sequelize } from "sequelize";

export class HotelSettingModel extends Model {
    declare id: string;
    declare value: number;
}

export function initializeHotelSettingModel(sequelize: Sequelize) {
    HotelSettingModel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true
            },
            value: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },
        {
            tableName: "hotel_settings",
            sequelize
        }
    );
}

export async function seedHotelSettings() {
    await HotelSettingModel.findOrCreate({
        where: {
            id: "room.user.trade.completion_duration"
        },

        defaults: {
            value: 5
        }
    });
    
    await HotelSettingModel.findOrCreate({
        where: {
            id: "room.user.idling_timeout"
        },

        defaults: {
            value: 180
        }
    });
    
    await HotelSettingModel.findOrCreate({
        where: {
            id: "room.max_floor_furniture"
        },

        defaults: {
            value: 4000
        }
    });
    
    await HotelSettingModel.findOrCreate({
        where: {
            id: "room.max_wall_furniture"
        },

        defaults: {
            value: 4000
        }
    });
}

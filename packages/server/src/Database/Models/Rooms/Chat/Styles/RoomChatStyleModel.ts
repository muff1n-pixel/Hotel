import { DataTypes, Model, Sequelize } from "sequelize";

export class RoomChatStyleModel extends Model {
    declare id: string;
    declare type: string;
}

export function initializeRoomChatStyleModel(sequelize: Sequelize) {
    RoomChatStyleModel.init({
          id: {
            type: new DataTypes.STRING(32),
            primaryKey: true,
          }
        },
        {
          tableName: 'room_chat_styles',
          sequelize
        },
    );
}

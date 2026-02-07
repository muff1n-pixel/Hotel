import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { UserModel } from "../../Users/UserModel.js";
import { RoomModel } from "../RoomModel.js";

export class RoomRightsModel extends Model {
    declare id: string;
    declare user: NonAttribute<UserModel>;
    declare room: NonAttribute<RoomModel>;
}

export function initializeRoomRightsModel(sequelize: Sequelize) {
    RoomRightsModel.init(
        {
          id: {
            type: DataTypes.UUID,
            primaryKey: true,
          }
        },
        {
          tableName: 'room_rights',
          sequelize,
        },
    );
    
    RoomRightsModel.belongsTo(RoomModel, {
        as: "room",
        foreignKey: "roomId"
    });
    
    RoomRightsModel.belongsTo(UserModel, {
        as: "user",
        foreignKey: "userId"
    });

    RoomModel.hasMany(RoomRightsModel, {
        as: "rights",
        foreignKey: "roomId"
    });
}

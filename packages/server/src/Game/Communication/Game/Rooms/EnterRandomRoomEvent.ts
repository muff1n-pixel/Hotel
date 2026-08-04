import { sequelize } from "../../../Database/Database.js";
import { RoomModel } from "../../../Database/Models/Rooms/RoomModel.js";
import User from "../../../Users/User.js";
import { game } from "../../../index.js";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { EnterRandomRoomData } from "@pixel63/events";

export default class EnterRandomRoomEvent implements ProtobuffListener<EnterRandomRoomData> {
    minimumDurationBetweenEvents?: number = 1000;

    async handle(user: User, payload: EnterRandomRoomData) {
        const roomModel = await RoomModel.scope({ method: [ 'withVisibility', user.model.id ] }).findOne({
            order: sequelize.random()
        });

        if(!roomModel) {
            throw new Error("Unable to find random room.");
        }
        
        if(user.room) {
            const roomUser = user.room.getRoomUser(user);

            roomUser.disconnect();
        }

        const roomInstance = await game.roomManager.getOrLoadRoomInstance(roomModel.id);

        if(!roomInstance) {
            console.error("Room does not exist.");

            return;
        }

        roomInstance.addUserClient(user);
    }
}

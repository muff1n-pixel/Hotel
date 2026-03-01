import User from "../../../../Users/User.js";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import { UseRoomFurnitureData } from "@pixel63/events";

export default class UseRoomFurnitureEvent implements ProtobuffListener<UseRoomFurnitureData> {
    async handle(user: User, payload: UseRoomFurnitureData) {
        if(!user.room) {
            return;
        }

        let roomUser = user.room.getRoomUser(user);
        const roomFurniture = user.room.getRoomFurniture(payload.id);

        const logic = roomFurniture.getCategoryLogic();

        if(logic) {
            await logic.use?.(roomUser, payload);
        }
    }
}

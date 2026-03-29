import User from "../../../Users/User.js";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { RoomDoubleClickData, RoomPositionOffsetData } from "@pixel63/events";

export default class RoomDoubleClickEvent implements ProtobuffListener<RoomDoubleClickData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: User, payload: RoomDoubleClickData) {
        if(!user.room) {
            return;
        }

        const roomUser = user.room.getRoomUser(user);

        if(payload.position) {
            const furnitureAtPosition = user.room.getAllFurnitureAtPosition(RoomPositionOffsetData.fromJSON(payload.position));

            for(const furniture of furnitureAtPosition) {
                furniture.logic?.handleUserDoubleClickOnTile?.(roomUser, payload.position).catch(console.error);
            }
        }
    }
}

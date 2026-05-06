import { UpdateRoomUserTradingData } from "@pixel63/events";
import ProtobuffListener from "../../../../Interfaces/ProtobuffListener.js";
import User from "../../../../../Users/User.js";

export default class UpdateRoomUserTradingEvent implements ProtobuffListener<UpdateRoomUserTradingData> {
    minimumDurationBetweenEvents?: number = 100;
    
    async handle(user: User, payload: UpdateRoomUserTradingData) {
        if(!user.room) {
            throw new Error("User is not in a room.");
        }

        const roomUser = user.room.getRoomUser(user);

        if(payload.userId !== roomUser.trading.tradingWithUser?.user.model.id) {
            throw new Error("Requested trading user is not being traded with.");
        }

        if(payload.addUserFurnitureId) {
            await roomUser.trading.addUserFurniture(payload.addUserFurnitureId, payload.addUserFurnitureQuantity);
        }
        
        if(payload.removeUserFurnitureId) {
            await roomUser.trading.removeUserFurniture(payload.removeUserFurnitureId);
        }
        
        if(payload.lock && !roomUser.trading.locked) {
            roomUser.trading.setLocked();
        }

        if(payload.cancel) {
            roomUser.trading.cancel();
        }
    }
}

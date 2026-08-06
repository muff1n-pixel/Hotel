import { UpdateRoomUserTradingData } from "@pixel63/events";
import { RoomProtobuffListener } from "../../../Interfaces/RoomProtobuffListener";
import User from "../../../../Users/User";

export default class UpdateRoomUserTradingEvent implements RoomProtobuffListener<UpdateRoomUserTradingData> {
    minimumDurationBetweenEvents?: number = 100;
    
    async handle(user: User, payload: UpdateRoomUserTradingData) {
        if(payload.userId !== user.roomUser.trading.tradingWithUser?.user.model.id) {
            throw new Error("Requested trading user is not being traded with.");
        }

        if(payload.addUserFurnitureId) {
            await user.roomUser.trading.addUserFurniture(payload.addUserFurnitureId, payload.addUserFurnitureQuantity);
        }
        
        if(payload.removeUserFurnitureId) {
            await user.roomUser.trading.removeUserFurniture(payload.removeUserFurnitureId);
        }
        
        if(payload.lock && !user.roomUser.trading.locked) {
            user.roomUser.trading.setLocked();
        }

        if(payload.cancel) {
            user.roomUser.trading.cancel();
        }
    }
}

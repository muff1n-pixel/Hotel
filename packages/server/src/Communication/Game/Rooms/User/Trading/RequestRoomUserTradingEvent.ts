import { RequestRoomUserTradingData, RoomUserTradingRequestData } from "@pixel63/events";
import ProtobuffListener from "../../../../Interfaces/ProtobuffListener.js";
import User from "../../../../../Users/User.js";

export default class RequestRoomUserTradingEvent implements ProtobuffListener<RequestRoomUserTradingData> {
    minimumDurationBetweenEvents?: number = 500;
    
    async handle(user: User, payload: RequestRoomUserTradingData) {
        if(!user.room) {
            throw new Error("User is not in a room.");
        }

        if(payload.targetUserId === user.model.id) {
            throw new Error("User cannot trade with themselves.");
        }

        const roomUser = user.room.getRoomUser(user);

        if(roomUser.trading.tradingWithUser) {
            throw new Error("User is already trading with a user.");
        }

        const targetRoomUser = user.room.getRoomUserById(payload.targetUserId);

        if(targetRoomUser.trading.requestedTradingWithUser?.user.model.id === user.model.id) {
            if(payload.accept) {
                roomUser.trading.startTrading(targetRoomUser);
                targetRoomUser.trading.startTrading(roomUser);
            }
            else {
                delete targetRoomUser.trading.requestedTradingWithUser;
            }

            return;
        }

        roomUser.trading.requestedTradingWithUser = targetRoomUser;

        targetRoomUser.user.sendProtobuff(RoomUserTradingRequestData, RoomUserTradingRequestData.create({
            userId: user.model.id
        }));
    }
}

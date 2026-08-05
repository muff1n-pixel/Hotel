import { RequestRoomUserTradingData, RoomUserTradingRequestData } from "@pixel63/events";
import { RoomProtobuffListener } from "../../../Interfaces/RoomProtobuffListener";
import RoomWebSocketUser from "../../../../Server/Users/RoomWebSocketUser";

export default class RequestRoomUserTradingEvent implements RoomProtobuffListener<RequestRoomUserTradingData> {
    minimumDurationBetweenEvents?: number = 500;
    
    async handle(user: RoomWebSocketUser, payload: RequestRoomUserTradingData) {
        if(payload.targetUserId === user.id) {
            throw new Error("User cannot trade with themselves.");
        }

        if(user.roomUser.trading.tradingWithUser) {
            throw new Error("User is already trading with a user.");
        }

        const targetRoomUser = user.roomUser.room.getRoomUserById(payload.targetUserId);

        if(targetRoomUser.trading.requestedTradingWithUser?.user.model.id === user.id) {
            if(payload.accept) {
                user.roomUser.trading.startTrading(targetRoomUser);
                targetRoomUser.trading.startTrading(user.roomUser);
            }
            else {
                delete targetRoomUser.trading.requestedTradingWithUser;
            }

            return;
        }
        
        switch(user.roomUser.room.model.trading) {
            case "disabled": {
                throw new Error("Trading is disabled in room.");
            }

            case "rights": {
                if(!user.roomUser.hasRights()) {
                    throw new Error("Trading is restricted to users with rights.");
                }

                break;
            }

            case "everyone": {
                break;
            }
        }

        user.roomUser.trading.requestedTradingWithUser = targetRoomUser;

        targetRoomUser.user.sendProtobuff(RoomUserTradingRequestData, RoomUserTradingRequestData.create({
            userId: user.id
        }));
    }
}

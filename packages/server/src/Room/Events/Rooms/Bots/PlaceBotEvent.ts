import RoomBot from "../../../Rooms/Bots/RoomBot.js";
import { PlaceRoomBotData, ServerUserInventoryUpdatedData } from "@pixel63/events";
import { RoomProtobuffListener } from "../../Interfaces/RoomProtobuffListener.js";
import RoomWebSocketUser from "../../../Server/Users/RoomWebSocketUser.js";
import { roomServer } from "../../../index.js";
import { UserBotModel } from "../../../../Database/Models/Users/Bots/UserBotModel.js";
import { UserModel } from "../../../../Database/Models/Users/UserModel.js";

export default class PlaceBotEvent implements RoomProtobuffListener<PlaceRoomBotData> {
    async handle(user: RoomWebSocketUser, payload: PlaceRoomBotData) {
        if(user.id !== user.roomUser.room.model.owner.id) {
            throw new Error("User does not own the room.");
        }

        const userBot = await UserBotModel.findOne({
            where: {
                id: payload.id,
                userId: user.id,
                roomId: null
            },
            include: [
                {
                    model: UserModel,
                    as: "user"
                }
            ]
        });

        if(!userBot) {
            throw new Error("User does not have a user bot by this id.");
        }

        if(!payload.position) {
            throw new Error();
        }

        roomServer.websocket.sendServerProtobuff(ServerUserInventoryUpdatedData, ServerUserInventoryUpdatedData.create({
            userId: user.id,
            botsRemoved: [ userBot.id ]
        }));

        await RoomBot.place(user.roomUser.room, userBot, payload.position, payload.direction);
    }
}

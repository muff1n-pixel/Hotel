import { GetRoomChatStylesData, RoomChatStylesData } from "@pixel63/events";
import { RoomChatStyleModel } from "../../../../../Database/Models/Rooms/Chat/Styles/RoomChatStyleModel.js";
import User from "../../../../../Users/User.js";
import IncomingEvent from "../../../../Interfaces/IncomingEvent.js";
import ProtobuffListener from "../../../../Interfaces/ProtobuffListener.js";

export default class GetRoomChatStylesEvent implements ProtobuffListener<GetRoomChatStylesData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: User) {
        const roomChatStyles = await RoomChatStyleModel.findAll();

        user.sendProtobuff(RoomChatStylesData, RoomChatStylesData.create({
            roomChatStyleIds: roomChatStyles.map((roomChatStyle) => roomChatStyle.id)
        }));
    }
}

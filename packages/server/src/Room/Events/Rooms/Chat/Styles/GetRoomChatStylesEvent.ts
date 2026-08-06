import { GetRoomChatStylesData, RoomChatStylesData } from "@pixel63/events";
import { RoomChatStyleModel } from "../../../../../Database/Models/Rooms/Chat/Styles/RoomChatStyleModel.js";
import { RoomProtobuffListener } from "../../../Interfaces/RoomProtobuffListener.js";
import User from "../../../../Users/User.js";

export default class GetRoomChatStylesEvent implements RoomProtobuffListener<GetRoomChatStylesData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: User) {
        const roomChatStyles = await RoomChatStyleModel.findAll();

        user.sendProtobuff(RoomChatStylesData, RoomChatStylesData.create({
            roomChatStyleIds: roomChatStyles.map((roomChatStyle) => roomChatStyle.id)
        }));
    }
}

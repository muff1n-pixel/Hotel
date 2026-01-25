import { RoomChatStyleModel } from "../../../../../Database/Models/Rooms/Chat/Styles/RoomChatStyleModel.js";
import OutgoingEvent from "../../../../../Events/Interfaces/OutgoingEvent.js";
import User from "../../../../../Users/User.js";
import IncomingEvent from "../../../../Interfaces/IncomingEvent.js";
import { RoomChatStylesEventData } from "@shared/Communications/Responses/Rooms/Chat/Styles/RoomChatStylesEventData.js";

export default class GetRoomChatStylesEvent implements IncomingEvent {
    async handle(user: User, event: null) {
        const roomChatStyles = await RoomChatStyleModel.findAll();

        user.send(new OutgoingEvent<RoomChatStylesEventData>("RoomChatStylesEvent", {
            roomChatStyles: roomChatStyles.map((roomChatStyle) => {
                return {
                    id: roomChatStyle.id
                };
            })
        }));
    }
}

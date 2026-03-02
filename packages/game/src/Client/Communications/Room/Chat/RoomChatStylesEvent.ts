import { clientInstance } from "../../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { RoomChatStylesData } from "@pixel63/events";

export default class RoomChatStylesEvent implements ProtobuffListener<RoomChatStylesData> {
    async handle(payload: RoomChatStylesData) {
        clientInstance.roomChatStyles.value = payload.roomChatStyleIds;
    }
}

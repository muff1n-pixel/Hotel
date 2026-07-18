import { clientInstance } from "../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { RoomGroupData } from "@pixel63/events";

export default class RoomGroupEvent implements ProtobuffListener<RoomGroupData> {
    async handle(payload: RoomGroupData) {
        if(!clientInstance.roomInstance.value) {
            throw new Error("Room instance is not created.");
        }

        if(clientInstance.roomInstance.value.information?.id !== payload.roomId) {
            throw new Error("Group room id does not match current room id.");
        }
        
        clientInstance.roomInstance.value.group.value = payload;
    }
}

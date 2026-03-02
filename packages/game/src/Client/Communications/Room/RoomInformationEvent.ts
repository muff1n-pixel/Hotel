import { clientInstance } from "../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { RoomInformationData } from "@pixel63/events";

export default class RoomInformationEvent implements ProtobuffListener<RoomInformationData> {
    async handle(payload: RoomInformationData) {
        if(!clientInstance.roomInstance.value) {
            throw new Error("Room instance is not created.");
        }
        
        clientInstance.roomInstance.value.information = payload;
        clientInstance.roomInstance.update();
    }
}

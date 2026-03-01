import { clientInstance } from "../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { RoomStructureData } from "@pixel63/events";

export default class RoomStructureEvent implements ProtobuffListener<RoomStructureData> {
    async handle(payload: RoomStructureData) {
        if(!clientInstance.roomInstance.value) {
            throw new Error("Room instance is not created.");
        }

        clientInstance.roomInstance.value.setStructure(payload);
    }
}

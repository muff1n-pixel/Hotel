import { clientInstance } from "../../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { RoomClickConfigurationData } from "@pixel63/events";

export default class RoomClickConfigurationEvent implements ProtobuffListener<RoomClickConfigurationData> {
    async handle(payload: RoomClickConfigurationData) {
        if(!clientInstance.roomInstance.value) {
            throw new Error("Room instance is not created.");
        }
        
        clientInstance.roomInstance.value.clickConfiguration.value = payload;
    }
}

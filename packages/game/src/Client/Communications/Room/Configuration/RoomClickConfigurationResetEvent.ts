import { clientInstance } from "../../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { RoomClickConfigurationResetData } from "@pixel63/events";

export default class RoomClickConfigurationResetEvent implements ProtobuffListener<RoomClickConfigurationResetData> {
    async handle(payload: RoomClickConfigurationResetData) {
        if(!clientInstance.roomInstance.value) {
            throw new Error("Room instance is not created.");
        }
        
        clientInstance.roomInstance.value.clickConfiguration.value = undefined;
    }
}

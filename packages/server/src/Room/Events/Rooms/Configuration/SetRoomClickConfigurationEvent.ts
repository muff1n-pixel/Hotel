import { RoomClickConfigurationData, SetRoomClickConfigurationData } from "@pixel63/events";
import { RoomProtobuffListener } from "../../Interfaces/RoomProtobuffListener.js";
import RoomWebSocketUser from "../../../Server/Users/RoomWebSocketUser.js";

export default class SetRoomClickConfigurationEvent implements RoomProtobuffListener<SetRoomClickConfigurationData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: RoomWebSocketUser, payload: SetRoomClickConfigurationData) {
        if(!user.roomUser.hasRights()) {
            throw new Error("User does not have rights.");
        }

        if(!user.roomUser.room.clickConfiguration) {
            throw new Error("Room click configuration is not set.");
        }

        user.roomUser.room.clickConfiguration.enabled = payload.enable;

        user.roomUser.room.sendProtobuff(RoomClickConfigurationData, user.roomUser.room.clickConfiguration);
    }
}

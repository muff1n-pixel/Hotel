import { RoomClickConfigurationData, SetRoomClickConfigurationData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener";
import User from "../../../../Users/User.js";

export default class SetRoomClickConfigurationEvent implements ProtobuffListener<SetRoomClickConfigurationData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: User, payload: SetRoomClickConfigurationData) {
        if(!user.room) {
            throw new Error("User is not in a room.");
        }
    
        const roomUser = user.room.getRoomUser(user);

        if(!roomUser.hasRights()) {
            throw new Error("User does not have rights.");
        }

        if(!roomUser.room.clickConfiguration) {
            throw new Error("Room click configuration is not set.");
        }

        roomUser.room.clickConfiguration.enabled = payload.enable;

        roomUser.room.sendProtobuff(RoomClickConfigurationData, roomUser.room.clickConfiguration);
    }
}

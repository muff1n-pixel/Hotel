import { ResetRoomClickConfigurationData, RoomClickConfigurationData, RoomClickConfigurationResetData, SetRoomClickConfigurationData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener";
import User from "../../../../Users/User.js";

export default class ResetRoomClickConfigurationEvent implements ProtobuffListener<ResetRoomClickConfigurationData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: User, payload: ResetRoomClickConfigurationData) {
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

        roomUser.room.clickConfiguration = undefined;

        roomUser.room.sendProtobuff(RoomClickConfigurationResetData, RoomClickConfigurationResetData.create({}));
    }
}

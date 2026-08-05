import { ResetRoomClickConfigurationData, RoomClickConfigurationResetData } from "@pixel63/events";
import { RoomProtobuffListener } from "../../Interfaces/RoomProtobuffListener.js";
import RoomWebSocketUser from "../../../Server/Users/RoomWebSocketUser.js";

export default class ResetRoomClickConfigurationEvent implements RoomProtobuffListener<ResetRoomClickConfigurationData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: RoomWebSocketUser, payload: ResetRoomClickConfigurationData) {
        if(!user.roomUser.hasRights()) {
            throw new Error("User does not have rights.");
        }

        if(!user.roomUser.room.clickConfiguration) {
            throw new Error("Room click configuration is not set.");
        }

        user.roomUser.room.clickConfiguration = undefined;

        user.roomUser.room.sendProtobuff(RoomClickConfigurationResetData, RoomClickConfigurationResetData.create({}));
    }
}

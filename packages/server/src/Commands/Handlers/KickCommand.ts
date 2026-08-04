import { HotelAlertData } from "@pixel63/events";
import RoomUser from "../../Rooms/Users/RoomUser";
import UserPermissions from "../../Users/Permissions/UserPermissions";
import Command from "../Command";
import { InvalidCommandParameterError } from "../Exceptions/InvalidCommandParameterError";

export default class KickCommand extends Command {
    public validate(roomUser: RoomUser, permissions: UserPermissions): boolean {
        return roomUser.hasRights();
    }

    async handle(roomUser: RoomUser): Promise<void> {
        const targetRoomUser = this.parseRoomUser("user");
        const reason = this.parseRemainingString("message", false);

        if(targetRoomUser.user.model.id === roomUser.user.model.id) {
            throw new InvalidCommandParameterError("You can't kick yourself!");
        }

        if(targetRoomUser.user.model.id === targetRoomUser.room.model.ownerId) {
            throw new InvalidCommandParameterError("You can't kick the owner of the room!");
        }

        if(targetRoomUser.hasRights() && (targetRoomUser.user.model.id !== roomUser.user.model.id)) {
            throw new InvalidCommandParameterError("Only the owner can kick another user with rights!");
        }

        targetRoomUser.disconnect();

        targetRoomUser.user.sendProtobuff(HotelAlertData, HotelAlertData.create({
            dialogType: "alert",
            message: (reason.length)?("You were kicked from the room! Reason: " + reason):("You were kicked from the room!")
        }));
    }
}

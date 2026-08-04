import RoomUser from "../../Rooms/Users/RoomUser";
import UserPermissions from "../../Users/Permissions/UserPermissions";
import Command from "../Command";

export default class TeleportCommand extends Command {
    public validate(roomUser: RoomUser, permissions: UserPermissions): boolean {
        return roomUser.hasRights();
    }

    async handle(roomUser: RoomUser): Promise<void> {
        roomUser.teleporting = !roomUser.teleporting;
    }
}

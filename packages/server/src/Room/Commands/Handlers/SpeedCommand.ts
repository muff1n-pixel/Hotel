import RoomUser from "../../../Room/Rooms/Users/RoomUser";
import UserPermissions from "../../Users/Permissions/UserPermissions";
import Command from "../Command";

export default class SpeedCommand extends Command {
    public validate(roomUser: RoomUser, permissions: UserPermissions): boolean {
        return roomUser.hasRights();    
    }

    async handle(roomUser: RoomUser): Promise<void> {
        const scale = Math.max(0, Math.min(2, this.parseFloat("scale")));

        roomUser.room.model.speed = scale;

        if(roomUser.room.model.changed()) {
            await roomUser.room.model.save();
        }
    }
}

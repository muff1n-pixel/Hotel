import RoomUser from "../../Rooms/Users/RoomUser";
import Command from "../Command";

export default class EnableCommand extends Command {
    async handle(roomUser: RoomUser): Promise<void> {
        const enableId = this.parseNumber("enableId");

        roomUser.removeAction("Dance");
        roomUser.removeAction("CarryItem");
        roomUser.removeAction("Sign");
        roomUser.removeAction("AvatarEffect");

        if(enableId !== 0) {
            roomUser.addAction("AvatarEffect." + enableId);
        } 
    }
}

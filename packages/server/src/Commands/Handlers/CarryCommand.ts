import RoomUser from "../../Rooms/Users/RoomUser";
import Command from "../Command";

export default class CarryCommand extends Command {
    async handle(roomUser: RoomUser): Promise<void> {
        const id = this.parseNumber("carryItemId");

        roomUser.removeAction("AvatarEffect");
        roomUser.removeAction("CarryItem");

        if(id !== 0) {
            roomUser.addAction("CarryItem." + id);
        } 
    }
}

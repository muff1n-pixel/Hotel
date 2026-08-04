import RoomUser from "../../Rooms/Users/RoomUser";
import Command from "../Command";

export default class CarryCommand extends Command {
    async handle(roomUser: RoomUser): Promise<void> {
        const id = this.parseNumber("carryItemId");

        roomUser.pose.removeEffect();

        if(id !== 0) {
            roomUser.pose.setEffect("CarryItem." + id);
        } 
    }
}

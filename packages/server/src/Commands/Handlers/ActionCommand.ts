import RoomUser from "../../Rooms/Users/RoomUser";
import Command from "../Command";

export default class ActionCommand extends Command {
    async handle(roomUser: RoomUser): Promise<void> {
        const action = this.parseString("actionId");

        if(roomUser.hasAction(action)) {
            roomUser.removeAction(action);
        }
        else {
            roomUser.addAction(action);
        }
    }
}

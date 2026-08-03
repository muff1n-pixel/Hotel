import RoomUser from "../../Rooms/Users/RoomUser";
import Command from "../Command";

export default class SitCommand extends Command {
    async handle(roomUser: RoomUser): Promise<void> {        
        await roomUser.path.finishPath();

        roomUser.addAction("Sit");
    }
}

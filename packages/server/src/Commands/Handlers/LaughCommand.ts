import RoomUser from "../../Rooms/Users/RoomUser";
import Command from "../Command";

export default class LaughCommand extends Command {
    async handle(roomUser: RoomUser): Promise<void> {        
        await roomUser.path.finishPath();

        roomUser.addAction("Laugh");
    }
}

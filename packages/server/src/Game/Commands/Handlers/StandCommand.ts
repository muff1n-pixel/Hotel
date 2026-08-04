import RoomUser from "../../Rooms/Users/RoomUser";
import Command from "../Command";

export default class StandCommand extends Command {
    async handle(roomUser: RoomUser): Promise<void> {        
        await roomUser.path.finishPath();

        roomUser.pose.stand();
    }
}

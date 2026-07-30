import RoomUser from "../../Rooms/Users/RoomUser";
import IncomingCommandHandler from "../Interfaces/IncomingCommandHandler";

export default class StandCommand implements IncomingCommandHandler {
    public readonly command = "stand";

    async handle(roomUser: RoomUser, inputs: string[]): Promise<void> {        
        await roomUser.path.finishPath();

        roomUser.removeAction("Sit");
    }
}

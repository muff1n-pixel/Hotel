import RoomUser from "../../Rooms/Users/RoomUser";
import IncomingCommandHandler from "../Interfaces/IncomingCommandHandler";

export default class SitCommand implements IncomingCommandHandler {
    public readonly command = "sit";

    async handle(roomUser: RoomUser, inputs: string[]): Promise<void> {        
        await roomUser.path.finishPath();

        roomUser.addAction("Sit");
    }
}

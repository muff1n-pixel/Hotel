import RoomUser from "../../Rooms/Users/RoomUser";
import IncomingCommandHandler from "../Interfaces/IncomingCommandHandler";

export default class LaughCommand implements IncomingCommandHandler {
    public readonly command = "laugh";

    async handle(roomUser: RoomUser, inputs: string[]): Promise<void> {        
        await roomUser.path.finishPath();

        roomUser.addAction("Laugh");
    }
}

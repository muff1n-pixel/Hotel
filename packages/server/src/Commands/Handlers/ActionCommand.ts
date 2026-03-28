import RoomUser from "../../Rooms/Users/RoomUser";
import IncomingCommandHandler from "../Interfaces/IncomingCommandHandler";

export default class ActionCommand implements IncomingCommandHandler {
    public readonly command = "action";

    async handle(roomUser: RoomUser, inputs: string[]): Promise<void> {
        if(!inputs[0]) {
            throw new Error("Missing action parameter.");
        }

        if(roomUser.hasAction(inputs[0])) {
            roomUser.removeAction(inputs[0]);
        }
        else {
            roomUser.addAction(inputs[0]);
        }
    }
}

import RoomUser from "../../Rooms/Users/RoomUser";
import IncomingCommandHandler from "../Interfaces/IncomingCommandHandler";

export default class DanceCommand implements IncomingCommandHandler {
    public readonly command = "dance";

    async handle(roomUser: RoomUser, inputs: string[]): Promise<void> {
        if(!inputs[0]) {
            throw new Error("Missing id parameter.");
        }

        const id = parseInt(inputs[0]);

        if(id < 0 || id > 4) {
            throw new Error("Dance doesn't exist.");
        }

        roomUser.removeAction("Dance");
        roomUser.removeAction("CarryItem");

        if(id !== 0) {
            roomUser.addAction("Dance." + id);
        } 
    }
}

import RoomUser from "../../Rooms/Users/RoomUser";
import IncomingCommandHandler from "../Interfaces/IncomingCommandHandler";

export default class EnableCommand implements IncomingCommandHandler {
    public readonly command = "enable";

    async handle(roomUser: RoomUser, inputs: string[]): Promise<void> {
        if(!inputs[0]) {
            throw new Error("Missing enable id parameter.");
        }

        const id = parseInt(inputs[0]);

        roomUser.removeAction("AvatarEffect");
        roomUser.removeAction("CarryItem");

        if(id !== 0) {
            roomUser.addAction("AvatarEffect." + id);
        } 
    }
}

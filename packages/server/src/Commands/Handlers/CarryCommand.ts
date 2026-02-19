import RoomUser from "../../Rooms/Users/RoomUser";
import IncomingCommandHandler from "../Interfaces/IncomingCommandHandler";

export default class CarryCommand implements IncomingCommandHandler {
    public readonly command = "carry";

    async handle(roomUser: RoomUser, inputs: string[]): Promise<void> {
        if(!inputs[0]) {
            throw new Error("Missing carry id parameter.");
        }

        const id = parseInt(inputs[0]);

        roomUser.removeAction("AvatarEffect");
        roomUser.removeAction("CarryItem");

        if(id !== 0) {
            roomUser.addAction("CarryItem." + id);
        } 
    }
}

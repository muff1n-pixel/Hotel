import RoomUser from "../../Rooms/Users/RoomUser";
import IncomingCommandHandler from "../Interfaces/IncomingCommandHandler";

export default class SignCommand implements IncomingCommandHandler {
    public readonly command = "sign";

    async handle(roomUser: RoomUser, inputs: string[]): Promise<void> {
        if(!inputs[0]) {
            throw new Error("Missing id parameter.");
        }

        const id = parseInt(inputs[0]);

        if(id < 0 || id > 17) {
            throw new Error("Sign does not exist.");
        }

        roomUser.removeAction("Dance");
        roomUser.removeAction("CarryItem");
        roomUser.removeAction("Sign");
        roomUser.removeAction("AvatarEffect");

        if(id !== 0) {
            roomUser.addAction("Sign." + id);
        } 
    }
}

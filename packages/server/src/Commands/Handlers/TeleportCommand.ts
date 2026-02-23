import RoomUser from "../../Rooms/Users/RoomUser";
import IncomingCommandHandler from "../Interfaces/IncomingCommandHandler";

export default class TeleportCommand implements IncomingCommandHandler {
    public readonly command = "teleport";

    async handle(roomUser: RoomUser, inputs: string[]): Promise<void> {
        if(!roomUser.hasRights()) {
            roomUser.sendRoomMessage(inputs.join());
            
            return;
        }

        roomUser.teleporting = !roomUser.teleporting;
    }
}

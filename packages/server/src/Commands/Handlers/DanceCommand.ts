import RoomUser from "../../Rooms/Users/RoomUser";
import Command from "../Command";
import { InvalidCommandParameterError } from "../Exceptions/InvalidCommandParameterError";

export default class DanceCommand extends Command {
    async handle(roomUser: RoomUser): Promise<void> {
        const danceId = this.parseNumber("danceId");

        if(danceId < 0 || danceId > 4) {
            throw new InvalidCommandParameterError("Dance doesn't exist.");
        }

        roomUser.removeAction("Dance");
        roomUser.removeAction("CarryItem");
        roomUser.removeAction("Sign");
        roomUser.removeAction("AvatarEffect");

        if(danceId !== 0) {
            roomUser.addAction("Dance." + danceId);
        } 
    }
}

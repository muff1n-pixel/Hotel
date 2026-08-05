import RoomUser from "../../../Room/Rooms/Users/RoomUser";
import Command from "../Command";
import { InvalidCommandParameterError } from "../Exceptions/InvalidCommandParameterError";

export default class DanceCommand extends Command {
    async handle(roomUser: RoomUser): Promise<void> {
        const danceId = this.parseNumber("danceId");

        if(danceId < 0 || danceId > 4) {
            throw new InvalidCommandParameterError("Dance doesn't exist.");
        }

        roomUser.pose.removeEffect();

        if(danceId !== 0) {
            roomUser.pose.setEffect("Dance." + danceId);
        } 
    }
}

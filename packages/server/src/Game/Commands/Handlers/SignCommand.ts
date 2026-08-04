import RoomUser from "../../Rooms/Users/RoomUser";
import Command from "../Command";
import { InvalidCommandParameterError } from "../Exceptions/InvalidCommandParameterError";

export default class SignCommand extends Command {
    async handle(roomUser: RoomUser): Promise<void> {
        const signId = this.parseNumber("signId");

        if(signId < 0 || signId > 17) {
            throw new InvalidCommandParameterError("Sign does not exist.");
        }

        roomUser.pose.removeEffect();

        roomUser.pose.setEffect("Sign." + signId);
    }
}

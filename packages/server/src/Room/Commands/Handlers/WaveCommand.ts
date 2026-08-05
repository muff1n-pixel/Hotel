import RoomUser from "../../../Room/Rooms/Users/RoomUser";
import Command from "../Command";

export default class WaveCommand extends Command {
    async handle(roomUser: RoomUser): Promise<void> {
        roomUser.pose.wave();
    }
}

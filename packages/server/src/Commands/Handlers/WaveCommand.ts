import RoomUser from "../../Rooms/Users/RoomUser";
import Command from "../Command";

export default class WaveCommand extends Command {
    async handle(roomUser: RoomUser): Promise<void> {
        roomUser.addAction("Wave");        
    }
}

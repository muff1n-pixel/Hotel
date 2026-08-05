import RoomUser from "../../../Room/Rooms/Users/RoomUser";
import Command from "../Command";

export default class EnableCommand extends Command {
    async handle(roomUser: RoomUser): Promise<void> {
        const enableId = this.parseNumber("enableId");

        roomUser.pose.removeEffect();

        if(enableId !== 0) {
            roomUser.pose.setEffect("AvatarEffect." + enableId);
        } 
    }
}

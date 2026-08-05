import { RoomUserData } from "@pixel63/events";
import RoomUser from "../../../Room/Rooms/Users/RoomUser";
import Command from "../Command";

export default class AwayFromKeyboardCommand extends Command {
    async handle(roomUser: RoomUser): Promise<void> {
        if(!roomUser.idling) {
            roomUser.idling = true;

            roomUser.room.sendProtobuff(RoomUserData, RoomUserData.create({
                id: roomUser.user.model.id,
                idling: true
            }));
        }
        else {
            roomUser.idling = false;

            roomUser.room.sendProtobuff(RoomUserData, RoomUserData.create({
                id: roomUser.user.model.id,
                idling: false
            }));
        }
    }
}

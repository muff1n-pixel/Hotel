import { RoomUserData } from "@pixel63/events";
import RoomUser from "../../Rooms/Users/RoomUser";
import IncomingCommandHandler from "../Interfaces/IncomingCommandHandler";

export default class AwayFromKeyboardCommand implements IncomingCommandHandler {
    public readonly command = "afk";

    async handle(roomUser: RoomUser, inputs: string[]): Promise<void> {
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

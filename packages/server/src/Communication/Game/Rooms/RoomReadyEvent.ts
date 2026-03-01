import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";

export default class RoomReadyEvent implements IncomingEvent {
    public readonly name = "RoomReadyEvent";

    async handle(user: User) {
        if(!user.room) {
            return;
        }

        const roomUser = user.room.getRoomUser(user);

        if(roomUser.ready) {
            return;
        }

        roomUser.ready = true;

        const furnitureWithUserEntersLogic = roomUser.room.furnitures.filter((furniture) => furniture.getCategoryLogic()?.handleUserEnteredRoom);

        for(const furniture of furnitureWithUserEntersLogic) {
            await furniture.getCategoryLogic()?.handleUserEnteredRoom?.(roomUser);
        }
    }
}


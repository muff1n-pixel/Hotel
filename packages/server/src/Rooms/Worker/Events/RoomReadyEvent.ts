import ProtobuffWorkerListener from "../../../Communication/Interfaces/ProtobuffWorkerListener.js";
import { RoomReadyData } from "@pixel63/events";
import RoomUser from "../../Users/RoomUser.js";

export default class RoomReadyEvent implements ProtobuffWorkerListener<RoomReadyData> {
    public readonly name = "RoomReadyEvent";

    async handle(user: RoomUser, payload: RoomReadyData) {
        if(user.ready) {
            return;
        }

        user.ready = true;

        const furnitureWithUserEntersLogic = user.room.furnitures.filter((furniture) => furniture.getCategoryLogic()?.handleUserEnteredRoom);

        for(const furniture of furnitureWithUserEntersLogic) {
            await furniture.getCategoryLogic()?.handleUserEnteredRoom?.(user);
        }
    }
}


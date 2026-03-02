import RoomUser from "../../../../Users/RoomUser";
import RoomFurniture from "../../../RoomFurniture";
import WiredTriggerLogic from "../WiredTriggerLogic";

export default class WiredTriggerCollisionLogic extends WiredTriggerLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleUserFurnitureCollission(roomUser: RoomUser, roomFurniture: RoomFurniture): Promise<void> {
        this.setActive();
        this.handleTrigger({
            roomUser,
            roomFurniture
        });
    }
}

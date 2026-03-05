import RoomUser from "../../../../Users/RoomUser.js";
import RoomFurniture from "../../../RoomFurniture.js";
import WiredTriggerLogic from "../WiredTriggerLogic.js";

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

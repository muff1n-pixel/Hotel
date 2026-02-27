import RoomUser from "../../../../Users/RoomUser";
import RoomFurniture from "../../../RoomFurniture";
import WiredTriggerLogic from "../WiredTriggerLogic";

export default class WiredTriggerCollisionLogic extends WiredTriggerLogic<unknown> {
    constructor(roomFurniture: RoomFurniture<unknown>) {
        super(roomFurniture);
    }

    public async handleUserFurnitureCollission(roomUser: RoomUser, roomFurniture: RoomFurniture): Promise<void> {
        this.setActive();
        this.handleTrigger(roomUser);
    }
}

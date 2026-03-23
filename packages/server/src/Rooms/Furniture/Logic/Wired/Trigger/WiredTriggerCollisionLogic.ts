import RoomUser from "../../../../Users/RoomUser";
import RoomFurniture from "../../../RoomFurniture";
import WiredTriggerLogic from "../WiredTriggerLogic";

export default class WiredTriggerCollisionLogic extends WiredTriggerLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleUserFurnitureCollission(roomUser: RoomUser, roomFurniture: RoomFurniture): Promise<void> {
        await this.setActive();
        
        this.handleTrigger({ roomUser, roomFurniture }).catch(console.error);
    }
}

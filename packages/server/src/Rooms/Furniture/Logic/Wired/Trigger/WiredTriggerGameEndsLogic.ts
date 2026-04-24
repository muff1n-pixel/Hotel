import RoomGame from "../../../../Games/RoomGame";
import RoomFurniture from "../../../RoomFurniture";
import WiredTriggerLogic from "../WiredTriggerLogic";

export default class WiredTriggerGameEndsLogic extends WiredTriggerLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }
    
    public async handleGameEnds(game: RoomGame): Promise<void> {
        await this.setActive();
            
        await this.handleTrigger();
    }
}

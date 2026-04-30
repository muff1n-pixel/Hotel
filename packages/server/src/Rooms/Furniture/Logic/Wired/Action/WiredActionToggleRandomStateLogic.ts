import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredActionLogic from "../WiredActionLogic";

export default class WiredActionToggleRandomStateLogic extends WiredActionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleAction(options?: WiredTriggerOptions): Promise<void> {
        if(!this.roomFurniture.model.data?.wiredActionToggleRandomState) {
            return;
        }

        let executed = false;

        for(const furnitureId of this.roomFurniture.model.data.wiredActionToggleRandomState.furnitureIds) {
            const roomFurniture = this.roomFurniture.room.furnitures.find((roomFurniture) => roomFurniture.model.id === furnitureId);

            if(!roomFurniture) {
                continue;
            }

            executed = true;

            const nextState = roomFurniture.model.furniture.animations[Math.floor(Math.random() * roomFurniture.model.furniture.animations.length)];

            if(nextState === undefined) {
                continue;
            }

            if(roomFurniture.model.animation === nextState) {
                continue;
            }

            await roomFurniture.setAnimation(nextState);
        }

        if(executed) {
            await this.setActive();
        }
    }
}

import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredActionLogic from "../WiredActionLogic";
import { RoomPositionData } from "@pixel63/events";

export default class WiredActionMatchToPositionStateLogic extends WiredActionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleAction(options?: WiredTriggerOptions): Promise<void> {
        if(!this.roomFurniture.model.data?.common?.furnitureState) {
            return;
        }

        let executed: boolean = false;

        for(const furniture of this.roomFurniture.model.data.common.furnitureState.furniture) {
            const roomFurniture = this.roomFurniture.room.furnitures.find((roomFurniture) => roomFurniture.model.id === furniture.furnitureId);

            if(!roomFurniture) {
                continue;
            }

            if(this.roomFurniture.model.data.common?.furnitureState.matchState) {
                await roomFurniture.setAnimation(furniture.animation);
            }
            
            if(this.roomFurniture.model.data.common?.furnitureState.matchDirection) {
                await roomFurniture.setDirection(furniture.direction);
            }
            
            if(this.roomFurniture.model.data.common?.furnitureState.matchPosition && furniture.position) {
                const position = RoomPositionData.fromJSON(furniture.position);

                if(!this.roomFurniture.model.data.common?.furnitureState.matchAltitude) {
                    position.depth = roomFurniture.model.position.depth;
                }

                await roomFurniture.movePosition(position);
            }
            else if(this.roomFurniture.model.data.common?.furnitureState.matchAltitude && furniture.position) {
                const position = RoomPositionData.fromJSON(roomFurniture.model.position);

                position.depth = furniture.position.depth;

                await roomFurniture.movePosition(position);
            }

            executed = true;
        }

        if(executed) {
            await this.setActive();
        }
    }
}

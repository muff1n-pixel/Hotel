import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredConditionLogic from "../WiredConditionLogic";

export default class WiredConditionMatchToPositionStateLogic extends WiredConditionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleCondition(options?: WiredTriggerOptions): Promise<boolean> {
        if(!this.roomFurniture.model.data?.common?.furnitureState) {
            return true;
        }

        for(const furniture of this.roomFurniture.model.data.common.furnitureState.furniture) {
            const roomFurniture = this.roomFurniture.room.furnitures.find((roomFurniture) => roomFurniture.model.id === furniture.furnitureId);

            if(!roomFurniture) {
                continue;
            }

            if(this.roomFurniture.model.data.common?.furnitureState.matchState) {
                if(roomFurniture.model.animation !== furniture.animation) {
                    return false;
                }
            }
            
            if(this.roomFurniture.model.data.common?.furnitureState.matchDirection) {
                if(roomFurniture.model.direction !== furniture.direction) {
                    return false;
                }
            }
            
            if(this.roomFurniture.model.data.common?.furnitureState.matchPosition) {
                if(roomFurniture.model.position.row !== furniture.position?.row || roomFurniture.model.position.column !== furniture.position?.column) {
                    return false;
                }
            }

            if(this.roomFurniture.model.data.common?.furnitureState.matchAltitude) {
                if(roomFurniture.model.position.depth !== furniture.position?.depth) {
                    return false;
                }
            }
        }

        return true;
    }
}

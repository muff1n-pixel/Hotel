import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredConditionLogic from "../WiredConditionLogic";
import { RoomPositionOffsetData } from "@pixel63/events";

export default class WiredConditionFurniHasUserLogic extends WiredConditionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleCondition(options?: WiredTriggerOptions): Promise<boolean> {
        if(!this.roomFurniture.model.data?.common?.furnitureSelection) {
            return true;
        }

        for(const furnitureId of this.roomFurniture.model.data.common.furnitureSelection.furnitureIds) {
            const roomFurniture = this.roomFurniture.room.furnitures.find((roomFurniture) => roomFurniture.model.id === furnitureId);

            if(!roomFurniture) {
                continue;
            }

            if(!roomFurniture.room.users.some((roomUser) => roomFurniture.isPositionInside(RoomPositionOffsetData.fromJSON(roomUser.position)))) {
                if(this.roomFurniture.model.data.wiredConditionFurniHasUsers?.requireAllFurni) {
                    return false;
                }
            }
            else if(!this.roomFurniture.model.data.wiredConditionFurniHasUsers?.requireAllFurni) {
                return false;
            }
        }

        return true;
    }
}

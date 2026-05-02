import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredConditionLogic from "../WiredConditionLogic";
import { RoomPositionOffsetData } from "@pixel63/events";

export default class WiredConditionUserOnFurnitureLogic extends WiredConditionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleCondition(options?: WiredTriggerOptions): Promise<boolean> {
        if(!this.roomFurniture.model.data?.common?.furnitureSelection) {
            return true;
        }

        if(!options?.roomUser) {
            return true;
        }

        for(const furnitureId of this.roomFurniture.model.data.common.furnitureSelection.furnitureIds) {
            const roomFurniture = this.roomFurniture.room.furnitures.find((roomFurniture) => roomFurniture.model.id === furnitureId);

            if(!roomFurniture) {
                continue;
            }

            if(!roomFurniture.isPositionInside(RoomPositionOffsetData.fromJSON(options.roomUser.position))) {
                return false;
            }
        }

        return true;
    }
}

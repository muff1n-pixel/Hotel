import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredActionLogic from "../WiredActionLogic";
import { RoomPositionData, RoomPositionOffsetData } from "@pixel63/events";

export default class WiredActionMoveFurniToUserLogic extends WiredActionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleAction(options?: WiredTriggerOptions): Promise<void> {
        if(!this.roomFurniture.model.data?.wiredActionMoveFurniToUser) {
            return;
        }

        if(!options?.roomUser) {
            return;
        }

        let executed = false;

        for(const furnitureId of this.roomFurniture.model.data.wiredActionMoveFurniToUser.furnitureIds) {
            const roomFurniture = this.roomFurniture.room.furnitures.find((roomFurniture) => roomFurniture.model.id === furnitureId);

            if(!roomFurniture) {
                continue;
            }

            executed = true;

            let nextPosition = this.getFurnitureNewPosition(RoomPositionOffsetData.fromJSON(options.roomUser.position));

            if(!nextPosition) {
                continue;
            }

            await roomFurniture.movePosition(nextPosition);
        }

        if(executed) {
            await this.setActive();
        }
    }
    
    private getFurnitureNewPosition(offsetPosition: RoomPositionOffsetData) {
        const upmostFurniture = this.roomFurniture.room.getUpmostFurnitureAtPosition(offsetPosition);

        if(upmostFurniture && !upmostFurniture.model.furniture.flags.stackable) {
            return null;
        }

        const upmostDepth = this.roomFurniture.room.getUpmostDepthAtPosition(offsetPosition, upmostFurniture);

        if(upmostDepth === null) {
            return null;
        }
        
        return RoomPositionData.create({
            ...offsetPosition,
            depth: upmostDepth
        });
    }
}

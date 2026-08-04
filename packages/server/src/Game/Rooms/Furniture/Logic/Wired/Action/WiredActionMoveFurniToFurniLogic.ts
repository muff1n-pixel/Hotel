import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredActionLogic from "../WiredActionLogic";
import { RoomPositionData, RoomPositionOffsetData } from "@pixel63/events";

export default class WiredActionMoveFurniToFurniLogic extends WiredActionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleAction(options?: WiredTriggerOptions): Promise<void> {
        if(!this.roomFurniture.model.data?.wiredActionMoveFurniToFurni) {
            return;
        }

        let executed = false;

        for(const furnitureId of this.roomFurniture.model.data.wiredActionMoveFurniToFurni.furnitureIds) {
            const roomFurniture = this.roomFurniture.room.furnitures.find((roomFurniture) => roomFurniture.model.id === furnitureId);

            if(!roomFurniture) {
                continue;
            }

            executed = true;

            const targetFurnitureId = this.roomFurniture.model.data.wiredActionMoveFurniToFurni.targetFurnitureIds[Math.floor(Math.random() * this.roomFurniture.model.data.wiredActionMoveFurniToFurni.targetFurnitureIds.length)];

            const targetRoomFurniture = this.roomFurniture.room.furnitures.find((roomFurniture) => roomFurniture.model.id === targetFurnitureId);

            if(!targetRoomFurniture) {
                continue;
            }

            let nextPosition = this.getFurnitureNewPosition(RoomPositionOffsetData.fromJSON(targetRoomFurniture.model.position));

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

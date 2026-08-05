import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredActionLogic from "../WiredActionLogic";
import { RoomFurnitureMovedData, RoomPositionData } from "@pixel63/events";

export default class WiredActionSetAltitudeLogic extends WiredActionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleAction(options?: WiredTriggerOptions): Promise<void> {
        if(!this.roomFurniture.model.data?.wiredActionSetAltitude) {
            return;
        }

        let executed = false;

        for(const furnitureId of this.roomFurniture.model.data.wiredActionSetAltitude.furnitureIds) {
            const roomFurniture = this.roomFurniture.room.furnitures.find((roomFurniture) => roomFurniture.model.id === furnitureId);

            if(!roomFurniture) {
                continue;
            }

            executed = true;

            let depth = roomFurniture.model.position.depth;

            switch(this.roomFurniture.model.data.wiredActionSetAltitude.action) {
                case "increase": {
                    depth += this.roomFurniture.model.data.wiredActionSetAltitude.depth;
                    
                    break;
                }

                case "decrease": {
                    depth -= this.roomFurniture.model.data.wiredActionSetAltitude.depth;
                    
                    break;
                }

                case "set": {
                    depth = this.roomFurniture.model.data.wiredActionSetAltitude.depth;
                    
                    break;
                }
            }

            depth = Math.min(80, depth);
            depth = Math.max(0, depth);

            const position = RoomPositionData.create({
                ...roomFurniture.model.position,
                depth
            });

            await roomFurniture.movePosition(position);
        }

        if(executed) {
            await this.setActive();
        }
    }
}

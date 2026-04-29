import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredActionLogic from "../WiredActionLogic";
import { RoomFurnitureMovedData, RoomPositionData, RoomPositionOffsetData } from "@pixel63/events";

export default class WiredActionMatchToPositionStateLogic extends WiredActionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleAction(options?: WiredTriggerOptions): Promise<void> {
        if(!this.roomFurniture.model.data?.wiredActionMatchToPositionState) {
            return;
        }

        let executed: boolean = false;

        for(const furniture of this.roomFurniture.model.data.wiredActionMatchToPositionState.furniture) {
            const roomFurniture = this.roomFurniture.room.furnitures.find((roomFurniture) => roomFurniture.model.id === furniture.furnitureId);

            if(!roomFurniture) {
                continue;
            }

            if(this.roomFurniture.model.data.wiredActionMatchToPositionState.matchState) {
                await roomFurniture.setAnimation(furniture.animation);
            }
            
            if(this.roomFurniture.model.data.wiredActionMatchToPositionState.matchDirection) {
                await roomFurniture.setDirection(furniture.direction);
            }
            
            if(this.roomFurniture.model.data.wiredActionMatchToPositionState.matchPosition && furniture.position) {
                const position = RoomPositionData.fromJSON(furniture.position);

                if(!this.roomFurniture.model.data.wiredActionMatchToPositionState.matchAltitude) {
                    position.depth = roomFurniture.model.position.depth;
                }

                await roomFurniture.setPosition(position, false);
                
                await roomFurniture.model.save();

                this.roomFurniture.room.sendProtobuff(RoomFurnitureMovedData, RoomFurnitureMovedData.create({
                    id: roomFurniture.model.id,
                    position
                }));
            }
            else if(this.roomFurniture.model.data.wiredActionMatchToPositionState.matchAltitude && furniture.position) {
                const position = RoomPositionData.fromJSON(roomFurniture.model.position);

                position.depth = furniture.position.depth;

                await roomFurniture.setPosition(position, false);
                
                await roomFurniture.model.save();

                this.roomFurniture.room.sendProtobuff(RoomFurnitureMovedData, RoomFurnitureMovedData.create({
                    id: roomFurniture.model.id,
                    position
                }));
            }

            executed = true;
        }

        if(executed) {
            await this.setActive();
        }
    }
}

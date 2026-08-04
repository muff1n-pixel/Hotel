import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredActionLogic from "../WiredActionLogic";
import { RoomPositionData, RoomPositionOffsetData } from "@pixel63/events";
import Directions from "../../../../../Helpers/Directions";
import WiredTriggerCollisionLogic from "../Trigger/WiredTriggerCollisionLogic";

export default class WiredActionFleeLogic extends WiredActionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleAction(options?: WiredTriggerOptions): Promise<void> {
        if(!this.roomFurniture.model.data?.common?.furnitureSelection?.furnitureIds) {
            return;
        }

        let executed = false;

        for(const furnitureId of this.roomFurniture.model.data.common.furnitureSelection.furnitureIds) {
            const roomFurniture = this.roomFurniture.room.furnitures.find((roomFurniture) => roomFurniture.model.id === furnitureId);

            if(!roomFurniture) {
                continue;
            }

            executed = true;

            const closestUser = this.roomFurniture.room.getClosestRoomUser(RoomPositionOffsetData.fromJSON(roomFurniture.model.position));

            if(!closestUser) {
                continue;
            }

            const targetDirection = Directions.normalizeDirection(Directions.getDirectionFromPositions(RoomPositionOffsetData.fromJSON(roomFurniture.model.position), RoomPositionOffsetData.fromJSON(closestUser.position)) + 4);

            const offsetPosition = roomFurniture.getOffsetPosition(1, targetDirection);

            const nextPosition = this.getNewFurniturePosition(offsetPosition);

            if(!nextPosition) {
                continue;
            }

            const blockingUser = this.roomFurniture.room.getRoomUserAtPosition(RoomPositionOffsetData.fromJSON(nextPosition));
            
            if(blockingUser) {
                const triggerFurniture = this.roomFurniture.room.getFurnitureWithCategory(WiredTriggerCollisionLogic);

                for(const logic of triggerFurniture) {
                    logic.handleUserFurnitureCollission(blockingUser, roomFurniture).catch(console.error);
                }

                continue;
            }

            await roomFurniture.movePosition(nextPosition);
        }

        if(executed) {
            await this.setActive();
        }
    }
    
    private getNewFurniturePosition(offsetPosition: RoomPositionOffsetData) {
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

import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredActionLogic from "../WiredActionLogic";
import { RoomPositionOffsetData } from "@pixel63/events";

export default class WiredActionCallStacksLogic extends WiredActionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleAction(options?: WiredTriggerOptions): Promise<void> {
        if(!this.roomFurniture.model.data?.wiredActionCallStacks) {
            return;
        }

        let executedStacks: RoomPositionOffsetData[] = [];

        for(const furnitureId of this.roomFurniture.model.data.wiredActionCallStacks.furnitureIds) {
            const roomFurniture = this.roomFurniture.room.furnitures.find((roomFurniture) => roomFurniture.model.id === furnitureId);

            if(!roomFurniture) {
                continue;
            }

            if(executedStacks.some((executedStack) => executedStack.row === roomFurniture.model.position.row && executedStack.column === roomFurniture.model.position.column)) {
                continue;
            }

            if(this.roomFurniture.model.position.row === roomFurniture.model.position.row && this.roomFurniture.model.position.column === roomFurniture.model.position.column) {
                continue;
            }

            executedStacks.push(RoomPositionOffsetData.create({
                row: roomFurniture.model.position.row,
                column: roomFurniture.model.position.column,
            }));

            const wiredStackFurniture = this.roomFurniture.room.furnitures.filter((furniture) =>
                furniture.model.position.row === roomFurniture.model.position.row
                && furniture.model.position.column === roomFurniture.model.position.column
            );
    
            const wiredStackActionFurniture = wiredStackFurniture.filter((furniture) => furniture.logic instanceof WiredActionLogic);
    
            Promise.all(wiredStackActionFurniture.map(async (furniture) => {
                const logic = furniture.logic as WiredActionLogic;
    
                await logic.handleAction?.(options);
            })).catch(console.error);
        }

        if(executedStacks.length) {
            await this.setActive();
        }
    }
}

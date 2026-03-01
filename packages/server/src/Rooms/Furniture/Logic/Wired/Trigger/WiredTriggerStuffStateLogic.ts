import RoomFurniture from "../../../RoomFurniture";
import WiredTriggerLogic from "../WiredTriggerLogic";

export default class WiredTriggerStuffStateLogic extends WiredTriggerLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleFurnitureAnimationChange(roomFurniture: RoomFurniture): Promise<void> {
        if(this.roomFurniture.model.data?.wiredTriggerStuffState?.selection?.furnitureSource === "list" && this.roomFurniture.model.data?.wiredTriggerStuffState.selection?.furnitureIds.length) {
            const index = this.roomFurniture.model.data.wiredTriggerStuffState.selection?.furnitureIds.indexOf(roomFurniture.model.id);

            if(index !== -1) {
                if(this.roomFurniture.model.data.wiredTriggerStuffState.trigger === "all") {
                    this.setActive();
                    
                    this.handleTrigger({
                        roomFurniture
                    });
                }
                else if(this.roomFurniture.model.data.wiredTriggerStuffState.trigger === "state") {
                    const expectedState = this.roomFurniture.model.data.wiredTriggerStuffState.furnitureTriggerStates.at(index);

                    if(expectedState !== undefined) {
                        if(roomFurniture.model.animation === expectedState) {
                            this.setActive();
                            
                            this.handleTrigger({
                                roomFurniture
                            });
                        }
                    }
                }
            }
        }
    }
}

import RoomFurnitureLogic, { RoomFurnitureHandleUserChatResult } from "../Interfaces/RoomFurnitureLogic";
import RoomFurniture from "../../RoomFurniture";
import RoomUser from "../../../Users/RoomUser";

export default class WiredLogic<T> implements RoomFurnitureLogic {
    public lastTriggered: number = 0;

    constructor(public readonly roomFurniture: RoomFurniture<T>) {

    }

    public async handleActionsInterval(): Promise<void> {
        if(this.roomFurniture.model.animation !== 0) {
            const elapsed = performance.now() - this.lastTriggered;

            if(elapsed >= 1500) {
                this.roomFurniture.setAnimation(0);
            }
        }
    }

    public getConnectedWired() {
        const furniture = this.roomFurniture.room.furnitures.find((furniture) => 
            furniture.model.position.row === this.roomFurniture.model.position.row
            && furniture.model.position.column === this.roomFurniture.model.position.column
            && furniture.model.position.depth === this.roomFurniture.model.position.depth + this.roomFurniture.model.furniture.dimensions.depth + 0.0001
        );

        if(!furniture) {
            return null;
        }

        const category = furniture.getCategoryLogic();

        if(!(category instanceof WiredLogic)) {
            return null;
        }

        return category;
    }

    public async handleTrigger(roomUser?: RoomUser) {
        const connectedWired = this.getConnectedWired();

        connectedWired?.handleTrigger(roomUser);
    }
}
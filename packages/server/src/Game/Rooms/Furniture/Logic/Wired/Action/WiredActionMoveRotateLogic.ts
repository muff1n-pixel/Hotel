import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredActionLogic from "../WiredActionLogic";
import { RoomFurnitureMovedData, RoomPositionData, RoomPositionOffsetData } from "@pixel63/events";

export default class WiredActionMoveRotateLogic extends WiredActionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleAction(options?: WiredTriggerOptions): Promise<void> {
        if(!this.roomFurniture.model.data?.wiredActionMoveRotate) {
            return;
        }

        const availableFurnitures = this.roomFurniture.room.furnitures.filter((furniture) => this.roomFurniture.model.data?.wiredActionMoveRotate?.furnitureIds.includes(furniture.model.id));

        for(const furniture of availableFurnitures) {
            await this.handleFurnitureRotation(furniture);
            await this.handleFurnitureMovement(furniture);
        }

        if(availableFurnitures.length > 0) {
            await this.setActive();
        }
    }

    private async handleFurnitureMovement(roomFurniture: RoomFurniture) {
        let offsetPosition: RoomPositionOffsetData | null = null;

        switch(this.roomFurniture.model.data?.wiredActionMoveRotate?.movement) {
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7": {
                offsetPosition = roomFurniture.getOffsetPosition(1, parseInt(this.roomFurniture.model.data.wiredActionMoveRotate.movement));
                
                break;
            }

            case "diagonal": {
                const direction = [2, 6][Math.floor(Math.random() * 2)];

                offsetPosition = roomFurniture.getOffsetPosition(1, direction);

                break;
            }

            case "vertical": {
                const direction = [0, 4][Math.floor(Math.random() * 2)];

                offsetPosition = roomFurniture.getOffsetPosition(1, direction);

                break;
            }

            case "random": {
                const direction = [0, 2, 4, 6][Math.floor(Math.random() * 4)];

                offsetPosition = roomFurniture.getOffsetPosition(1, direction);

                break;
            }
        }

        if(!offsetPosition) {
            return;
        }

        const upmostFurniture = roomFurniture.room.getUpmostFurnitureAtPosition(offsetPosition);

        if(upmostFurniture && !upmostFurniture.model.furniture.flags.stackable) {
            return;
        }

        const upmostDepth = roomFurniture.room.getUpmostDepthAtPosition(offsetPosition, upmostFurniture);

        if(upmostDepth === null) {
            return;
        }
        
        const position = RoomPositionData.create({
            ...offsetPosition,
            depth: upmostDepth
        });

        await roomFurniture.movePosition(position);
    }

    private async handleFurnitureRotation(roomFurniture: RoomFurniture) {
        let direction: number | null = null;

        switch(this.roomFurniture.model.data?.wiredActionMoveRotate?.rotation) {
            case "clockwise": {
                direction = roomFurniture.getNextDirection();
                
                break;
            }

            case "counter-clockwise": {
                direction = roomFurniture.getPreviousDirection();
                
                break;
            }

            case "random": {
                direction = (Math.floor(Math.random() * 2) === 1)?(roomFurniture.getNextDirection()):(roomFurniture.getPreviousDirection());

                break;
            }
        }

        if(direction === null) {
            return;
        }

        await roomFurniture.setDirection(direction);
    }
}

import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredActionLogic from "../WiredActionLogic";
import { RoomPositionOffsetData } from "@pixel63/events";
import RoomUser from "../../../../Users/RoomUser";

export default class WiredActionMoveRotateUserLogic extends WiredActionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleAction(options?: WiredTriggerOptions): Promise<void> {
        if(!this.roomFurniture.model.data?.wiredActionMoveRotateUser) {
            return;
        }

        if(!options?.roomUser) {
            return;
        }

        await this.handleUserRotation(options.roomUser);
        await this.handleUserMovement(options.roomUser);
        
        await this.setActive();
    }

    private async handleUserMovement(roomUser: RoomUser) {
        let offsetPosition: RoomPositionOffsetData | null = null;

        switch(this.roomFurniture.model.data?.wiredActionMoveRotateUser?.movement) {
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7": {
                offsetPosition = RoomPositionOffsetData.fromJSON(roomUser.getOffsetPosition(parseInt(this.roomFurniture.model.data.wiredActionMoveRotateUser.movement), 1));
                
                break;
            }
        }

        if(!offsetPosition) {
            return;
        }

        roomUser.path.teleportTo(offsetPosition, true, false);
    }

    private async handleUserRotation(roomUser: RoomUser) {
        let direction: number | null = null;

        switch(this.roomFurniture.model.data?.wiredActionMoveRotateUser?.rotation) {
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7": {
                direction = parseInt(this.roomFurniture.model.data.wiredActionMoveRotateUser.rotation);
                
                break;
            }

            case "clockwise": {
                direction = (roomUser.direction + 1) % 8;
                
                break;
            }

            case "counter-clockwise": {
                direction = (roomUser.direction + 7) % 8;
                
                break;
            }
        }

        if(direction === null) {
            return;
        }

        roomUser.path.setDirection(direction);
    }
}

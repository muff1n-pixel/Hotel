import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredActionLogic from "../WiredActionLogic";
import { RoomFurnitureMovedData, RoomPositionData, RoomPositionOffsetData } from "@pixel63/events";
import RoomUser from "../../../../Users/RoomUser";
import Directions from "../../../../../Helpers/Directions";
import WiredTriggerCollisionLogic from "../Trigger/WiredTriggerCollisionLogic";

export default class WiredActionMoveToDirectionLogic extends WiredActionLogic {
    private furnitureDirections: Map<string, number> = new Map();

    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public handleDataChanged(roomUser: RoomUser): void {
        this.furnitureDirections.clear();
    }

    public async handleAction(options?: WiredTriggerOptions): Promise<void> {
        if(!this.roomFurniture.model.data?.wiredActionMoveToDirection) {
            return;
        }

        let executed = false;

        for(const furnitureId of this.roomFurniture.model.data.wiredActionMoveToDirection.furnitureIds) {
            const roomFurniture = this.roomFurniture.room.furnitures.find((roomFurniture) => roomFurniture.model.id === furnitureId);

            if(!roomFurniture) {
                continue;
            }

            executed = true;

            let direction: number | null = this.furnitureDirections.get(roomFurniture.model.id) ?? this.roomFurniture.model.data.wiredActionMoveToDirection.startDirection;

            let nextPosition = this.getFurniturePosition(roomFurniture, direction);

            if(!nextPosition) {
                direction = this.getFurnitureNextDirection(direction);

                if(direction === null) {
                    continue;
                }

                this.furnitureDirections.set(roomFurniture.model.id, direction);

                nextPosition = this.getFurniturePosition(roomFurniture, direction);

                if(!nextPosition) {
                    continue;
                }
            }

            if(this.roomFurniture.model.data.wiredActionMoveToDirection.blockCollidingWithUsers) {
                const blockingUser = this.roomFurniture.room.getRoomUserAtPosition(RoomPositionOffsetData.fromJSON(nextPosition));
                
                if(blockingUser) {
                    const triggerFurniture = this.roomFurniture.room.getFurnitureWithCategory(WiredTriggerCollisionLogic);

                    for(const logic of triggerFurniture) {
                        logic.handleUserFurnitureCollission(blockingUser, roomFurniture).catch(console.error);
                    }

                    continue;
                }
            }

            await roomFurniture.movePosition(nextPosition);
        }

        if(executed) {
            await this.setActive();
        }
    }

    private getFurnitureNextDirection(direction: number) {
        switch(this.roomFurniture.model.data?.wiredActionMoveToDirection?.blockedDirectionAction) {
            case "wait": {
                return null;
            }

            case "right_45_degrees": {
                return Directions.normalizeDirection(direction + 1);
            }

            case "right_90_degrees": {
                return Directions.normalizeDirection(direction + 2);
            }

            case "left_45_degrees": {
                return Directions.normalizeDirection(direction - 1);
            }

            case "left_90_degrees": {
                return Directions.normalizeDirection(direction - 2);
            }

            case "back": {
                return Directions.normalizeDirection(direction + 4);
            }

            case "random": {
                return Math.floor(Math.random() * 8);
            }
        }

        return direction;
    }
    
    private getFurniturePosition(roomFurniture: RoomFurniture, direction: number) {
        const offsetPosition = roomFurniture.getOffsetPosition(1, direction);

        if(!offsetPosition) {
            return null;
        }

        const upmostFurniture = roomFurniture.room.getUpmostFurnitureAtPosition(offsetPosition);

        if(upmostFurniture && !upmostFurniture.model.furniture.flags.stackable) {
            return null;
        }

        const upmostDepth = roomFurniture.room.getUpmostDepthAtPosition(offsetPosition, upmostFurniture);

        if(upmostDepth === null) {
            return null;
        }
        
        const position = RoomPositionData.create({
            ...offsetPosition,
            depth: upmostDepth
        });

        return position;
    }
}

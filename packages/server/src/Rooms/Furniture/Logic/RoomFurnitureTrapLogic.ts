import { RoomPositionOffsetData, UserFurnitureAnimationTag, UserFurnitureCustomData, UseRoomFurnitureData } from "@pixel63/events";
import RoomUser from "../../Users/RoomUser.js";
import RoomFurniture from "../RoomFurniture.js";
import RoomFurnitureLogic from "./Interfaces/RoomFurnitureLogic.js";

// Animation ID 0 = active
// Animation ID 1 = not active
// Animation ID 100 = animate to not active (12 ticks)
// Animation ID 101 = animate to active (24 ticks)

export default class RoomFurnitureTrapLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {
        this.roomFurniture.setAnimation(1).catch(console.error);
    }

    async use(roomUser: RoomUser, payload: UseRoomFurnitureData): Promise<void> {
    }

    private trapActivatedAt: number = 0;
    private trapDeactivatedAt: number = performance.now();

    isWalkable(): boolean {
        return this.roomFurniture.model.animation === 1;
    }

    async handleActionsInterval(): Promise<void> {
        if(this.roomFurniture.model.animation === 0) {
            if(performance.now() - this.trapActivatedAt < 5000) {
                return;
            }

            this.trapDeactivatedAt = performance.now();

            await this.roomFurniture.setAnimation(100);

            setTimeout(() => {
                this.roomFurniture.setAnimation(1).catch(console.error);
            }, 500);
        }
        else if(this.roomFurniture.model.animation === 1) {
            if(performance.now() - this.trapDeactivatedAt < 10000) {
                return;
            }

            if(this.roomFurniture.room.getActorsAtPosition(RoomPositionOffsetData.fromJSON(this.roomFurniture.model.position)).length > 0) {
                return;
            }

            this.trapActivatedAt = performance.now();

            await this.roomFurniture.setAnimation(101);

            setTimeout(() => {
                this.roomFurniture.setAnimation(0).catch(console.error);
            }, 1000);
        }
    }
}

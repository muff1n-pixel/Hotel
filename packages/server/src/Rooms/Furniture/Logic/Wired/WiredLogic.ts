import RoomFurnitureLogic, { RoomFurnitureHandleUserChatResult } from "../Interfaces/RoomFurnitureLogic";
import RoomFurniture from "../../RoomFurniture";
import RoomUser from "../../../Users/RoomUser";
import WiredActionLogic from "./WiredActionLogic";

export type WiredTriggerOptions = {
    roomUser?: RoomUser;
    roomFurniture?: RoomFurniture;
    signalFurniture?: RoomFurniture;
};

export default class WiredLogic implements RoomFurnitureLogic {
    public lastTriggered: number = 0;

    constructor(public readonly roomFurniture: RoomFurniture) {
        this.roomFurniture.setAnimation(0).catch(console.error);
    }

    public handleDataChanged?(roomUser: RoomUser): void;

    public async handleActionsInterval(): Promise<void> {
        if(this.roomFurniture.model.animation !== 0) {
            const elapsed = performance.now() - this.lastTriggered;

            if(elapsed >= 1500) {
                await this.roomFurniture.setAnimation(0);
            }
        }
    }

    public getConnectedWired() {
        const furniture = this.roomFurniture.room.furnitures.find((furniture) => 
            furniture.model.id !== this.roomFurniture.model.id
            && furniture.model.position.row === this.roomFurniture.model.position.row
            && furniture.model.position.column === this.roomFurniture.model.position.column
            && (Math.round(furniture.model.position.depth * 100) / 100) === (Math.round((this.roomFurniture.model.position.depth + this.roomFurniture.model.furniture.dimensions.depth + 0.0001) * 100) / 100)
        );

        if(!furniture) {
            return null;
        }

        if(!(furniture.logic instanceof WiredLogic)) {
            return null;
        }

        return furniture.logic;
    }

    public async setActive() {
        this.lastTriggered = performance.now();
        await this.roomFurniture.setAnimation(101);
    }

    public getCommonDelayData() {
        return this.roomFurniture.model.data?.common?.delay;
    }
}
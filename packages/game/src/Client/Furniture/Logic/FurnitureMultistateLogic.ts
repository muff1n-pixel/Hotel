import FurnitureLogic from "@Client/Furniture/Logic/Interfaces/FurnitureLogic";
import RoomInstance from "@Client/Room/RoomInstance";
import { webSocketClient } from "../../..";
import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";
import { UseRoomFurnitureData } from "@pixel63/events";

export default class FurnitureMultistateLogic implements FurnitureLogic {
    constructor(private readonly room: RoomInstance, private readonly roomFurniture: RoomFurniture) {
    }

    isAvailable() {
        if(!this.room.hasRights) {
            return false;
        }
        
        return (this.roomFurniture.furniture.animation !== this.getNextState());
    }

    use(): void {
        if(!this.isAvailable()) {
            return;
        }

        const nextState = this.getNextState();

        webSocketClient.sendProtobuff(UseRoomFurnitureData, UseRoomFurnitureData.create({
            id: this.roomFurniture.data.id,
            animation: nextState
        }));
    }

    public getNextState() {
        if(!this.roomFurniture.furniture.data) {
            return this.roomFurniture.furniture.animation;
        }

        const visualization = this.roomFurniture.furniture.getVisualizationData(this.roomFurniture.furniture.data);

        const currentAnimationIndex = visualization.animations.findIndex((animation) => animation.id === this.roomFurniture.furniture.animation);

        if(currentAnimationIndex === -1) {
            return visualization.animations[0]?.id ?? 0;
        }

        if(!visualization.animations[currentAnimationIndex + 1]) {
            return 0;
        }

        return visualization.animations[currentAnimationIndex + 1].id;
    }
}

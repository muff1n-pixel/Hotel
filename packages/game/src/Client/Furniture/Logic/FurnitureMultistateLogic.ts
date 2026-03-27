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
        
        return true;
    }

    use(tag?: string): void {
        if(!this.isAvailable()) {
            return;
        }

        const nextState = this.getNextState();

        webSocketClient.sendProtobuff(UseRoomFurnitureData, UseRoomFurnitureData.create({
            id: this.roomFurniture.data.id,
            animation: nextState,
            tag
        }));
    }
    
    public getNextState() {
        if(!this.roomFurniture.furniture.data) {
            return this.roomFurniture.furniture.animation;
        }

        const visualization = this.roomFurniture.furniture.getVisualizationData(this.roomFurniture.furniture.data);

        let filteredAnimations = visualization.animations;

        if(filteredAnimations.some((animation) => animation.transitionTo !== undefined)) {
            filteredAnimations = visualization.animations.filter((animation) => animation.transitionTo !== undefined);
        }

        const currentAnimationIndex = filteredAnimations.findIndex((animation) => animation.id === this.roomFurniture.furniture.animation);

        if(currentAnimationIndex === -1) {
            return filteredAnimations[0]?.id ?? 0;
        }

        if(!filteredAnimations[currentAnimationIndex + 1]) {
            return 0;
        }

        return filteredAnimations[currentAnimationIndex + 1].id;
    }
}

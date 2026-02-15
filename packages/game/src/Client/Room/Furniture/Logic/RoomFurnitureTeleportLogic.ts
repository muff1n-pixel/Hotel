import FurnitureLogic from "@Client/Furniture/Logic/Interfaces/FurnitureLogic";
import RoomInstance from "@Client/Room/RoomInstance";
import { UseRoomFurnitureEventData } from "@Shared/Communications/Requests/Rooms/Furniture/UseRoomFurnitureEventData";
import { webSocketClient } from "../../../..";
import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";

export default class RoomFurnitureTeleportLogic implements FurnitureLogic {
    constructor(private readonly room: RoomInstance, private readonly roomFurniture: RoomFurniture) {
    }

    isAvailable() {
        return true;
    }

    use(): void {
        if(!this.isAvailable()) {
            return;
        }

        const nextState = this.getNextState();

        webSocketClient.send<UseRoomFurnitureEventData>("UseRoomFurnitureEvent", {
            roomFurnitureId: this.roomFurniture.data.id,
            animation: nextState
        });
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

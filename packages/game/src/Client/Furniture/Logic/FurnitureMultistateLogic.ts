import Furniture from "@Client/Furniture/Furniture";
import FurnitureLogic from "@Client/Furniture/Logic/Interfaces/FurnitureLogic";
import { FurnitureData } from "@Client/Interfaces/Furniture/FurnitureData";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";
import { webSocketClient } from "../../..";
import { UseRoomFurnitureEventData } from "@Shared/Communications/Requests/Rooms/Furniture/UseRoomFurnitureEventData";

export default class FurnitureMultistateLogic implements FurnitureLogic {
    constructor(private readonly furniture: Furniture, private readonly data: FurnitureData) {
    }

    isAvailable() {
        return (this.furniture.animation !== this.getNextState());
    }

    use(roomFurniture: RoomInstanceFurniture): void {
        if(!this.isAvailable()) {
            return;
        }

        const nextState = this.getNextState();

        webSocketClient.send<UseRoomFurnitureEventData>("UseRoomFurnitureEvent", {
            roomFurnitureId: roomFurniture.data.id,
            animation: nextState
        });
    }

    public getNextState() {
        const visualization = this.furniture.getVisualizationData(this.data);

        const currentAnimationIndex = visualization.animations.findIndex((animation) => animation.id === this.furniture.animation);

        if(currentAnimationIndex === -1) {
            return visualization.animations[0]?.id ?? 0;
        }

        if(!visualization.animations[currentAnimationIndex + 1]) {
            return 0;
        }

        return visualization.animations[currentAnimationIndex + 1].id;
    }
}

import Room from "../Room.js";
import { RoomFurnitureModel } from "../../Database/Models/Rooms/RoomFurnitureModel.js";
import { RoomFurnitureData } from "@shared/Interfaces/Room/RoomFurnitureData.js";
import OutgoingEvent from "../../Events/Interfaces/OutgoingEvent.js";
import { RoomFurnitureEventData } from "@shared/Communications/Responses/Rooms/Furniture/RoomFurnitureEventData.js";

export default class RoomFurnitureItem {
    constructor(private readonly room: Room, public readonly model: RoomFurnitureModel) {
    }

    public getFurnitureData(): RoomFurnitureData {
        return {
            id: this.model.id,
            furniture: this.model.furniture,
            position: this.model.position,
            direction: this.model.direction,
            animation: this.model.animation
        };
    }

    public pickup() {
        this.room.furnitures.splice(this.room.furnitures.indexOf(this), 1);

        this.room.sendRoomEvent(new OutgoingEvent<RoomFurnitureEventData>("RoomFurnitureEvent", {
            furnitureRemoved: [
                {
                    id: this.model.id
                }
            ]
        }));

        this.model.destroy();

        // TODO: add furniture back to user inventory
    }
}

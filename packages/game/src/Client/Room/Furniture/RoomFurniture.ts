import Furniture from "@Client/Furniture/Furniture";
import RoomFurnitureItem from "@Client/Room/Items/Furniture/RoomFurnitureItem";
import RoomInstance from "@Client/Room/RoomInstance";
import { RoomFurnitureData } from "@Shared/Interfaces/Room/RoomFurnitureData";
import { RoomMoodlightData } from "@Shared/Interfaces/Room/RoomMoodlightData";

export default class RoomFurniture {
    public readonly furniture: Furniture;
    public readonly item: RoomFurnitureItem;

    constructor(private readonly instance: RoomInstance, public data: RoomFurnitureData) {
        this.furniture = new Furniture(this.data.furniture.type, 64, this.data.direction, this.data.animation, this.data.furniture.color);
        this.item = new RoomFurnitureItem(this.instance.roomRenderer, this.furniture, this.data.position);

        this.instance.roomRenderer.items.push(this.item);

        if(this.data.furniture.interactionType === "dimmer") {
            if((this.data.data as RoomMoodlightData)?.enabled) {
                this.instance.setMoodlight(this.data.data as RoomMoodlightData);
            }
        }
    }

    public updateData(data: RoomFurnitureData) {        
        if(data.furniture.interactionType === "dimmer") {
            if((data.data as RoomMoodlightData)?.enabled || (this.data.data as RoomMoodlightData)?.enabled) {
                this.instance.setMoodlight(data.data as RoomMoodlightData);
            }
        }

        this.data = data;

        this.item.furnitureRenderer.direction = this.data.direction = data.direction;
        this.item.furnitureRenderer.animation = this.data.animation = data.animation;

        if(data.position) {
            this.item.setPosition(data.position);
        }
    }
}
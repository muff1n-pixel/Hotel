import Furniture from "@Client/Furniture/Furniture";
import FurnitureDefaultLogic from "@Client/Furniture/Logic/FurnitureDefaultLogic";
import FurnitureMultistateLogic from "@Client/Furniture/Logic/FurnitureMultistateLogic";
import FurnitureRoomDimmerLogic from "@Client/Furniture/Logic/FurnitureRoomDimmerLogic";
import { RoomPosition } from "@Client/Interfaces/RoomPosition";
import RoomFurnitureBackgroundLogic from "@Client/Room/Furniture/Logic/RoomFurnitureBackgroundLogic";
import RoomFurnitureBackgroundTonerLogic from "@Client/Room/Furniture/Logic/RoomFurnitureBackgroundTonerLogic";
import RoomFurnitureDiceLogic from "@Client/Room/Furniture/Logic/RoomFurnitureDiceLogic";
import RoomFurnitureLogic from "@Client/Room/Furniture/Logic/RoomFurnitureLogic";
import RoomFurnitureTeleportLogic from "@Client/Room/Furniture/Logic/RoomFurnitureTeleportLogic";
import RoomFurnitureItem from "@Client/Room/Items/Furniture/RoomFurnitureItem";
import RoomInstance from "@Client/Room/RoomInstance";
import { RoomFurnitureBackgroundTonerData } from "@Shared/Interfaces/Room/Furniture/RoomFurnitureBackgroundTonerData";
import { RoomFurnitureData } from "@Shared/Interfaces/Room/RoomFurnitureData";
import { RoomMoodlightData } from "@Shared/Interfaces/Room/RoomMoodlightData";
import RoomFurnitureStickieLogic from "@Client/Room/Furniture/Logic/RoomFurnitureStickieLogic";
import RoomFurnitureTrophyLogic from "@Client/Room/Furniture/Logic/RoomFurnitureTrophyLogic";
import RoomFurnitureFortunaLogic from "@Client/Room/Furniture/Logic/RoomFurnitureFortunaLogic";
import RoomFurnitureWiredLogic from "@Client/Room/Furniture/Logic/Wired/RoomFurnitureWiredLogic";

export default class RoomFurniture {
    public readonly furniture: Furniture;
    public readonly item: RoomFurnitureItem;

    constructor(private readonly instance: RoomInstance, public data: RoomFurnitureData) {
        this.furniture = new Furniture(this.data.furniture.type, 64, this.data.direction, this.data.animation, this.data.furniture.color);
        this.item = new RoomFurnitureItem(this.instance.roomRenderer, this.furniture, this.data.position, this.data.data as any);

        this.instance.roomRenderer.items.push(this.item);

        /*if(this.data.furniture.interactionType === "dimmer") {
            if((this.data.data as RoomMoodlightData)?.enabled) {
                this.instance.setMoodlight(this.data.data as RoomMoodlightData);
            }
        }
        else if(this.data.furniture.interactionType === "background_toner") {
            if((this.data.data as RoomFurnitureBackgroundTonerData)?.enabled) {
                this.instance.setBackgroundToner(this.data.data as RoomFurnitureBackgroundTonerData);
            }
        }*/

        this.updateData(data);
    }
    
    public getLogic(): RoomFurnitureLogic {
        if(!this.furniture.data) {
            throw new Error("Furniture data is not available.");
        }

        switch(this.data.furniture.interactionType) {
            case "postit":
                return new RoomFurnitureStickieLogic(this.instance, this);

            case "dice":
                return new RoomFurnitureDiceLogic(this.instance, this);

            case "fortuna":
                return new RoomFurnitureFortunaLogic(this.instance, this);

            case "vendingmachine":
                return new RoomFurnitureTeleportLogic(this.instance, this);

            case "background_toner":
                return new RoomFurnitureBackgroundTonerLogic(this.instance, this);

            case "teleport":
            case "teleporttile":
                return new RoomFurnitureTeleportLogic(this.instance, this);

            case "gate":
                return new FurnitureMultistateLogic(this.instance, this);

            case "multiheight":
            case "default":
                return new FurnitureMultistateLogic(this.instance, this);
                
            case "ads_bg":
                return new RoomFurnitureBackgroundLogic(this.instance, this);

            case "dimmer":
                return new FurnitureRoomDimmerLogic(this.instance, this);

            case "trophy":
                return new RoomFurnitureTrophyLogic(this.instance, this);

            case "conf_invis_control":
                return new FurnitureMultistateLogic(this.instance, this);
        }

        if(this.data.furniture.interactionType.startsWith("wf_trg") || this.data.furniture.interactionType.startsWith("wf_act")) {
            return new RoomFurnitureWiredLogic(this.instance, this);
        }

        return new FurnitureDefaultLogic(this.instance, this);
    }

    public getDimensionDepth() {
        if(this.data.furniture.interactionType === "multiheight" && this.data.furniture.customParams?.[0]) {
            return this.data.furniture.dimensions.depth + ((this.data.furniture.customParams[0] as number) * this.data.animation);
        }

        return this.data.furniture.dimensions.depth;
    }

    public updateData(data: RoomFurnitureData) {        
        if(data.furniture.interactionType === "dimmer") {
            if((data.data as RoomMoodlightData)?.enabled || (this.data.data as RoomMoodlightData)?.enabled) {
                this.instance.setMoodlight(data.data as RoomMoodlightData);
            }
        }
        else if(this.data.furniture.interactionType === "background_toner") {
            if((data.data as RoomFurnitureBackgroundTonerData)?.enabled || (this.data.data as RoomFurnitureBackgroundTonerData)?.enabled) {
                this.instance.setBackgroundToner(data.data as RoomFurnitureBackgroundTonerData);
            }
        }
        else if(this.data.furniture.interactionType === "conf_invis_control") {
            const invisibleTiles = this.instance.furnitures.filter((furniture) => furniture.data.furniture.type.startsWith("room_invisible_"));

            for(const invisibleFurniture of invisibleTiles) {
                invisibleFurniture.item.disabled = (data.animation === 1);
            }
        }
        else if(this.data.furniture.type.startsWith("room_invisible_")) {
            const controllerFurniture = this.instance.furnitures.find((furniture) => furniture.data.furniture.interactionType === "conf_invis_control");

            if(controllerFurniture) {
                this.item.disabled = (controllerFurniture.data.animation === 1);
            }
        }

        this.data = data;

        this.item.furnitureRenderer.direction = this.data.direction = data.direction;
        this.item.furnitureRenderer.animation = this.data.animation = data.animation;
        this.item.furnitureRenderer.color = this.data.color ?? this.data.furniture.color ?? null;

        if(data.position) {
            this.item.setPosition(data.position);
        }

        if(data.data) {
            this.item.setData(data.data);
        }
    }

    isPositionInside(position: Omit<RoomPosition, "depth">, dimensions: RoomPosition) {
        if(this.item.furnitureRenderer.placement !== "floor") {
            return false;
        }

        if(this.data.position.row >= position.row + dimensions.row) {
            return false;
        }

        if(this.data.position.column >= position.column + dimensions.column) {
            return false;
        }

        const furnitureDimensions = this.item.furnitureRenderer.getDimensions();

        if(this.data.position.row + furnitureDimensions.row <= position.row) {
            return false;
        }

        if(this.data.position.column + furnitureDimensions.column <= position.column) {
            return false;
        }

        return true;
    }
}
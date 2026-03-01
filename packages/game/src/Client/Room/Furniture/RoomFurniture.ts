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
import RoomFurnitureStickieLogic from "@Client/Room/Furniture/Logic/RoomFurnitureStickieLogic";
import RoomFurnitureTrophyLogic from "@Client/Room/Furniture/Logic/RoomFurnitureTrophyLogic";
import RoomFurnitureFortunaLogic from "@Client/Room/Furniture/Logic/RoomFurnitureFortunaLogic";
import RoomFurnitureWiredLogic from "@Client/Room/Furniture/Logic/Wired/RoomFurnitureWiredLogic";
import { UserFurnitureData } from "@pixel63/events";

export default class RoomFurniture {
    public readonly furniture: Furniture;
    public readonly item: RoomFurnitureItem;

    constructor(private readonly instance: RoomInstance, public data: UserFurnitureData) {
        this.furniture = new Furniture(this.data.furniture?.type, 64, this.data.direction, this.data.animation, this.data.furniture?.color);
        this.item = new RoomFurnitureItem(this.instance.roomRenderer, this.furniture, this.data.position, this.data.data as any);

        this.instance.roomRenderer.items.push(this.item);

        this.updateData(data);
    }
    
    public getLogic(): RoomFurnitureLogic {
        if(!this.furniture.data) {
            throw new Error("Furniture data is not available.");
        }

        switch(this.data.furniture?.interactionType) {
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

        if(this.data.furniture?.interactionType.startsWith("wf_trg") || this.data.furniture?.interactionType.startsWith("wf_act")) {
            return new RoomFurnitureWiredLogic(this.instance, this);
        }

        return new FurnitureDefaultLogic(this.instance, this);
    }

    public getDimensionDepth() {
        if(!this.data.furniture?.dimensions) {
            throw new Error();
        }

        if(this.data.furniture?.interactionType === "multiheight" && this.data.furniture?.customParams?.[0]) {
            return this.data.furniture?.dimensions?.depth + ((this.data.furniture?.customParams[0] as any as number) * this.data.animation);
        }

        return this.data.furniture?.dimensions?.depth;
    }

    public updateData(payload: UserFurnitureData) {       
        if(!payload.furniture) {
            throw new Error();
        } 

        if(payload.data) { 
            if(payload.furniture?.interactionType === "dimmer" && payload.data.moodlight) {
                if(payload.data.moodlight.enabled || this.data.data?.moodlight?.enabled) {
                    this.instance.setMoodlight(payload.data.moodlight);
                }
            }
            else if(this.data.furniture?.interactionType === "background_toner" && payload.data.toner) {
                if(payload.data.toner.enabled || this.data.data?.toner?.enabled) {
                    this.instance.setBackgroundToner(payload.data.toner);
                }
            }
        }

        if(this.data.furniture?.interactionType === "conf_invis_control") {
            const invisibleTiles = this.instance.furnitures.filter((furniture) => furniture.data.furniture?.type.startsWith("room_invisible_"));

            for(const invisibleFurniture of invisibleTiles) {
                invisibleFurniture.item.disabled = (payload.animation === 1);
            }
        }
        else if(this.data.furniture?.type.startsWith("room_invisible_")) {
            const controllerFurniture = this.instance.furnitures.find((furniture) => furniture.data.furniture?.interactionType === "conf_invis_control");

            if(controllerFurniture) {
                this.item.disabled = (controllerFurniture.data.animation === 1);
            }
        }

        this.data = payload;

        this.item.furnitureRenderer.direction = this.data.direction = payload.direction;
        this.item.furnitureRenderer.animation = this.data.animation = payload.animation;
        this.item.furnitureRenderer.color = this.data.color ?? this.data.furniture?.color ?? undefined;

        if(payload.position) {
            this.item.setPosition(payload.position);
        }

        if(payload.data) {
            this.item.setData(payload.data);
        }
    }

    isPositionInside(position: Omit<RoomPosition, "depth">, dimensions: RoomPosition) {
        if(this.item.furnitureRenderer.placement !== "floor") {
            return false;
        }

        if(!this.data.position) {
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
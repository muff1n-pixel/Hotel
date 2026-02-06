import Room from "../Room.js";
import { UserFurnitureModel } from "../../Database/Models/Users/Furniture/UserFurnitureModel.js";
import { RoomFurnitureData } from "@shared/Interfaces/Room/RoomFurnitureData.js";
import OutgoingEvent from "../../Events/Interfaces/OutgoingEvent.js";
import { RoomFurnitureEventData } from "@shared/Communications/Responses/Rooms/Furniture/RoomFurnitureEventData.js";
import { RoomPosition } from "@shared/Interfaces/Room/RoomPosition.js";
import { game } from "../../index.js";
import RoomFurnitureTeleportLogic from "./Logic/RoomFurnitureTeleportLogic.js";
import RoomFurnitureGateLogic from "./Logic/RoomFurnitureGateLogic.js";
import RoomFurnitureLightingLogic from "./Logic/RoomFurnitureLightingLogic.js";
import { NonAttributeBrand } from "@sequelize/core";

export default class RoomFurniture {
    constructor(private readonly room: Room, public readonly model: UserFurnitureModel) {
        if(model.furniture.category === "teleport") {
            model.animation = 0;
        }
    }

    public static async place(room: Room, userFurniture: UserFurnitureModel, position: RoomPosition, direction: number) {
        await userFurniture.update({
            position,
            direction,
            roomId: room.model.id
        });

        room.sendRoomEvent(new OutgoingEvent<RoomFurnitureEventData>("RoomFurnitureEvent", {
            furnitureAdded: [
                {
                    id: userFurniture.id,
                    furniture: userFurniture.furniture,
                    position: userFurniture.position,
                    direction: userFurniture.direction,
                    animation: userFurniture.animation,
                    data: userFurniture.data
                }
            ]
        }));

        const roomFurniture = new RoomFurniture(room, userFurniture);

        room.furnitures.push(roomFurniture);

        return roomFurniture;
    }

    public getFurnitureData(): RoomFurnitureData {
        return {
            id: this.model.id,
            furniture: this.model.furniture,
            position: this.model.position,
            direction: this.model.direction,
            animation: this.model.animation,
            data: this.model.data
        };
    }

    public async pickup() {
        this.room.furnitures.splice(this.room.furnitures.indexOf(this), 1);

        this.room.sendRoomEvent(new OutgoingEvent<RoomFurnitureEventData>("RoomFurnitureEvent", {
            furnitureRemoved: [
                {
                    id: this.model.id
                }
            ]
        }));

        await this.model.update({
            roomId: null
        });

        const user = game.getUserById(this.model.user.id);

        if(user) {
            user.getInventory().addFurniture(this.model);
        }
    }

    public isWalkable() {
        if(this.model.furniture.flags.walkable) {
            return true;
        }

        // it can be walked through or used as final destination
        if(this.model.furniture.flags.sitable) {
            return true;
        }

        // if animation id is 1, the gate is unlocked
        if(this.model.furniture.category === "gate" && this.model.animation !== 0) {
            return true;
        }

        return false;
    }

    // figure action to be used when user is on furniture
    public getFigureActions(): string[] {
        if(this.model.furniture.flags.sitable) {
            return ["Sit"];
        }

        return [];
    }

    public isPositionInside(position: Omit<RoomPosition, "depth">) {
        if(this.model.furniture.placement !== "floor") {
            return false;
        }

        if(this.model.position.row > position.row) {
            return false;
        }

        if(this.model.position.column > position.column) {
            return false;
        }

        const dimensions = (this.model.direction === 0 || this.model.direction === 4)?({
            row: this.model.furniture.dimensions.column,
            column: this.model.furniture.dimensions.row,
            depth: this.model.furniture.dimensions.depth,
        }):({
            row: this.model.furniture.dimensions.row,
            column: this.model.furniture.dimensions.column,
            depth: this.model.furniture.dimensions.depth,
        });

        if(this.model.position.row + dimensions.row <= position.row) {
            return false;
        }

        if(this.model.position.column + dimensions.column <= position.column) {
            return false;
        }

        return true;
    }

    public getData<T>() {
        return {...(this.model.data ?? {})} as T;
    }

    public getCategoryLogic() {
        switch(this.model.furniture.category) {
            case "teleport":
                return new RoomFurnitureTeleportLogic(this);
                
            case "gate":
                return new RoomFurnitureGateLogic(this);
                
            case "lighting":
                return new RoomFurnitureLightingLogic(this);
        }

        return null;
    }

    public getOffsetPosition(offset: number) {
        const position = {...this.model.position};

        switch(this.model.direction) {
            case 0:
                position.row -= offset;
                break;

            case 2:
                position.column += offset;
                break;
            
            case 4:
                position.row += offset;
                break;
            
            case 6:
                position.column -= offset;
                break;
        }

        return position;
    }

    public async setAnimation(animation: number, save: boolean = true) {
        this.model.animation = animation;

        if(this.model.changed()) {
            await this.model.save();

            this.room.sendRoomEvent(new OutgoingEvent<RoomFurnitureEventData>("RoomFurnitureEvent", {
                furnitureUpdated: [
                    this.getFurnitureData()
                ]
            }));
        }
    }
}

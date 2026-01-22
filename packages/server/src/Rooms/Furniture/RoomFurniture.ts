import Room from "../Room.js";
import { RoomFurnitureModel } from "../../Database/Models/Rooms/RoomFurnitureModel.js";
import { RoomFurnitureData } from "@shared/Interfaces/Room/RoomFurnitureData.js";
import OutgoingEvent from "../../Events/Interfaces/OutgoingEvent.js";
import { RoomFurnitureEventData } from "@shared/Communications/Responses/Rooms/Furniture/RoomFurnitureEventData.js";
import { FurnitureModel } from "../../Database/Models/Furniture/FurnitureModel.js";
import { RoomPosition } from "@shared/Interfaces/Room/RoomPosition.js";
import { randomUUID } from "node:crypto";

export default class RoomFurniture {
    constructor(private readonly room: Room, public readonly model: RoomFurnitureModel) {
    }

    public static async create(room: Room, furniture: FurnitureModel, position: RoomPosition, direction: number) {
        const createdRoomFurniture = await RoomFurnitureModel.create({
            id: randomUUID(),
            roomId: room.model.id,
            furnitureId: furniture.id,
            position: position,
            direction,
            animation: 0
        });

        const roomFurnitureModel = await RoomFurnitureModel.findByPk(createdRoomFurniture.id, {
            include: {
                model: FurnitureModel,
                as: "furniture"
            }
        });

        if(!roomFurnitureModel) {
            throw new Error("Created room furniture does not exist.");
        }

        room.sendRoomEvent(new OutgoingEvent<RoomFurnitureEventData>("RoomFurnitureEvent", {
            furnitureAdded: [
                {
                    id: roomFurnitureModel.id,
                    furniture: roomFurnitureModel.furniture,
                    position: roomFurnitureModel.position,
                    direction: roomFurnitureModel.direction,
                    animation: roomFurnitureModel.animation
                }
            ]
        }));

        const roomFurniture = new RoomFurniture(room, roomFurnitureModel);

        room.furnitures.push(roomFurniture);

        return roomFurniture;
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
}

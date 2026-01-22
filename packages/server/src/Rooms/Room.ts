import User from "../Users/User.js";
import { RoomModel } from "../Database/Models/Rooms/RoomModel.js";
import OutgoingEvent from "../Events/Interfaces/OutgoingEvent.js";
import RoomUser from "./Users/RoomUser.js";
import RoomFurnitureItem from "./Furniture/RoomFurnitureItem.js";
import { FurnitureModel } from "../Database/Models/Furniture/FurnitureModel.js";
import { RoomPosition } from "@shared/Interfaces/Room/RoomPosition.js";
import { RoomFurnitureModel } from "../Database/Models/Rooms/RoomFurnitureModel.js";
import { randomUUID } from "node:crypto";
import { RoomFurnitureEventData } from "@shared/Communications/Responses/Rooms/Furniture/RoomFurnitureEventData.js";

export default class Room {
    public readonly users: RoomUser[] = [];
    public readonly furnitures: RoomFurnitureItem[] = [];

    // TODO: is there a better way to handle actions instead of an interval?
    private actionsInterval?: NodeJS.Timeout;

    constructor(public readonly model: RoomModel) {
        this.furnitures = model.roomFurnitures.map((roomFurniture) => new RoomFurnitureItem(this, roomFurniture));
    }

    public addUserClient(user: User) {
        this.users.push(new RoomUser(this, user));
    }

    public async addFurniture(furniture: FurnitureModel, position: RoomPosition, direction: number) {
        const createdRoomFurniture = await RoomFurnitureModel.create({
            id: randomUUID(),
            roomId: this.model.id,
            furnitureId: furniture.id,
            position: position,
            direction,
            animation: 0
        });

        const roomFurniture = await RoomFurnitureModel.findByPk(createdRoomFurniture.id, {
            include: {
                model: FurnitureModel,
                as: "furniture"
            }
        });

        if(!roomFurniture) {
            throw new Error("Created room furniture does not exist.");
        }

        this.sendRoomEvent(new OutgoingEvent<RoomFurnitureEventData>("RoomFurnitureEvent", {
            furnitureAdded: [
                {
                    id: roomFurniture.id,
                    furniture: roomFurniture.furniture,
                    position: roomFurniture.position,
                    direction: roomFurniture.direction,
                    animation: roomFurniture.animation
                }
            ]
        }));

        this.furnitures.push(new RoomFurnitureItem(this, roomFurniture));
    }

    public sendRoomEvent(outgoingEvents: OutgoingEvent | OutgoingEvent[]) {
        this.users.forEach((user) => {
            user.user.send(outgoingEvents);
        });
    }

    public getRoomFurniture(roomFurnitureItemId: string) {
        const furniture = this.furnitures.find((furniture) => furniture.model.id === roomFurnitureItemId);

        if(!furniture) {
            throw new Error("Furniture does not exist in room.");
        }

        return furniture;
    }

    public getRoomUser(client: User) {
        const user = this.users.find((user) => user.user.model.id === client.model.id);

        if(!user) {
            throw new Error("User does not exist in room.");
        }

        return user;
    }

    public requestActionsFrame() {
        if(this.actionsInterval === undefined) {
            this.actionsInterval = setInterval(this.handleActionsInterval.bind(this), 500);

            this.handleActionsInterval();
        }
    }

    private handleActionsInterval() {
        const outgoingEvents: OutgoingEvent[] = [];

        const usersWithPath = this.users.filter((user) => user.path?.length);

        // TODO: change so that the clients get the full path immediately, and only use this interval to cancel due to obstructions in the path?
        for(let user of usersWithPath) {
            outgoingEvents.push(...user.handleActionsInterval());
        }

        if(outgoingEvents.length) {
            this.sendRoomEvent(outgoingEvents);
        }

        if(!this.users.some((user) => user.path?.length)) {
            clearInterval(this.actionsInterval);

            delete this.actionsInterval;
        }
    }

    public isPositionInFurniture(furniture: RoomFurnitureItem, position: Omit<RoomPosition, "depth">) {
        if(furniture.model.furniture.placement !== "floor") {
            return false;
        }

        if(furniture.model.position.row > position.row) {
            return false;
        }

        if(furniture.model.position.column > position.column) {
            return false;
        }

        const dimensions = (furniture.model.direction === 0 || furniture.model.direction === 4)?({
            row: furniture.model.furniture.dimensions.column,
            column: furniture.model.furniture.dimensions.row,
            depth: furniture.model.furniture.dimensions.depth,
        }):({
            row: furniture.model.furniture.dimensions.row,
            column: furniture.model.furniture.dimensions.column,
            depth: furniture.model.furniture.dimensions.depth,
        });

        if(furniture.model.position.row + dimensions.row <= position.row) {
            return false;
        }

        if(furniture.model.position.column + dimensions.column <= position.column) {
            return false;
        }

        return true;
    }

    public getUpmostFurnitureAtPosition(position: Omit<RoomPosition, "depth">) {
        const furniture = this.furnitures
            .filter((furniture) => this.isPositionInFurniture(furniture, position))
            .toSorted((a, b) => b.model.position.depth - a.model.position.depth);

        if(!furniture.length) {
            return undefined;
        }

        return furniture[0];
    }

    public getUpmostDepthAtPosition(position: Omit<RoomPosition, "depth">, furniture?: RoomFurnitureItem) {
        if(!furniture) {
            if(!this.model.structure.grid[position.row] || !this.model.structure.grid[position.row]![position.column]) {
                return 0;
            }

            return parseInt(this.model.structure.grid[position.row]![position.column]!)
        }

        if(furniture.model.furniture.flags.sitable) {
            return furniture.model.position.depth;
        }

        return furniture.model.position.depth + furniture.model.furniture.dimensions.depth;
    }
}

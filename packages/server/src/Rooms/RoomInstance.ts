import UserClient from "../Clients/UserClient.js";
import { RoomModel } from "../Database/Models/Rooms/RoomModel.js";
import OutgoingEvent from "../Events/Interfaces/OutgoingEvent.js";
import RoomUser from "./Users/RoomUser.js";
import RoomFurnitureItem from "./Items/RoomFurnitureItem.js";
import { UserWalkTo } from "@shared/WebSocket/Events/Rooms/Users/UserWalkTo.js";
import { FurnitureModel } from "../Database/Models/Furniture/FurnitureModel.js";
import { RoomPosition } from "@shared/Interfaces/Room/RoomPosition.js";
import { RoomFurnitureModel } from "../Database/Models/Rooms/RoomFurnitureModel.js";
import { randomUUID } from "node:crypto";
import { RoomFurnitureUpdated } from "@shared/WebSocket/Events/Rooms/Furniture/RoomFurnitureUpdated.js";

export default class RoomInstance {
    public readonly users: RoomUser[] = [];
    public readonly furnitures: RoomFurnitureItem[] = [];

    // TODO: is there a better way to handle actions instead of an interval?
    private actionsInterval?: NodeJS.Timeout;

    constructor(public readonly room: RoomModel) {
        this.furnitures = room.roomFurnitures.map((roomFurniture) => new RoomFurnitureItem(this, roomFurniture));
    }

    public addUserClient(userClient: UserClient) {
        this.users.push(new RoomUser(this, userClient));
    }

    public async addFurniture(furniture: FurnitureModel, position: RoomPosition, direction: number) {
        const createdRoomFurniture = await RoomFurnitureModel.create({
            id: randomUUID(),
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

        this.sendRoomEvent(new OutgoingEvent<RoomFurnitureUpdated>("RoomFurnitureUpdated", {
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
            user.userClient.send(outgoingEvents);
        });
    }

    private getRoomUser(client: UserClient) {
        const user = this.users.find((user) => user.userClient.user.id === client.user.id);

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

    public getUpmostFurnitureAtPosition(position: Omit<RoomPosition, "depth">) {
        const furniture = this.furnitures
            .filter((furniture) => 
                furniture.roomFurniture.position.row === position.row
                && furniture.roomFurniture.position.column === position.column)
            .toSorted((a, b) => a.roomFurniture.position.depth - b.roomFurniture.position.depth);

        if(!furniture.length) {
            return undefined;
        }

        return furniture[0];
    }

    public getUpmostDepthAtPosition(position: Omit<RoomPosition, "depth">, furniture?: RoomFurnitureItem) {
        if(!furniture) {
            if(!this.room.structure.grid[position.row] || !this.room.structure.grid[position.row]![position.column]) {
                return 0;
            }

            return parseInt(this.room.structure.grid[position.row]![position.column]!)
        }

        return furniture.roomFurniture.position.depth + furniture.roomFurniture.furniture.dimensions.depth;
    }
}

import { RoomUserData } from "@shared/Interfaces/Room/RoomUserData.js";
import UserClient from "../Clients/UserClient.js";
import { Room } from "../Database/Models/Rooms/Room.js";
import OutgoingEvent from "../Events/Interfaces/OutgoingEvent.js";
import RoomUserClient from "./Items/RoomUserClient.js";
import { LoadRoom } from "@shared/WebSocket/Events/Rooms/LoadRoom.js";
import { UserEnteredRoom } from "@shared/WebSocket/Events/Rooms/Users/UserEnteredRoom.js";
import RoomFurnitureItem from "./Items/RoomFurnitureItem.js";
import { RoomFurnitureData } from "@shared/Interfaces/Room/RoomFurnitureData.js";
import { StartWalking } from "@shared/WebSocket/Events/Rooms/Users/StartWalking.js";
import { AStarFinder } from "astar-typescript";
import { UserWalkTo } from "@shared/WebSocket/Events/Rooms/Users/UserWalkTo.js";
import { UserLeftRoom } from "@shared/WebSocket/Events/Rooms/Users/UserLeftRoom.js";

export default class RoomInstance {
    private readonly users: RoomUserClient[] = [];
    private readonly furnitures: RoomFurnitureItem[] = [];

    // TODO: is there a better way to handle actions instead of an interval?
    private actionsInterval?: NodeJS.Timeout;

    constructor(public readonly room: Room) {
        this.furnitures = room.roomFurnitures.map((roomFurniture) => new RoomFurnitureItem(this, roomFurniture));
    }

    public addUserClient(userClient: UserClient) {
        const roomUserClient = new RoomUserClient(this, userClient);

        roomUserClient.userClient.addListener("close", this.userLeftRoom.bind(this));

        roomUserClient.userClient.addListener<StartWalking>("StartWalking", this.userStartWalking.bind(this));

        const userEnteredRoomEvent = new OutgoingEvent<UserEnteredRoom>("UserEnteredRoom", this.getRoomUserData(roomUserClient));

        this.sendRoomEvent(userEnteredRoomEvent);

        roomUserClient.userClient.send([
            new OutgoingEvent<LoadRoom>("LoadRoom", {
                structure: this.room.structure,
                users: this.users.map((user) => this.getRoomUserData(user)),
                furnitures: this.furnitures.map(this.getFurnitureData)
            }),
            userEnteredRoomEvent
        ]);

        this.users.push(roomUserClient);
    }

    private getRoomUserData(roomUserClient: RoomUserClient): RoomUserData {
        return {
            id: roomUserClient.userClient.user.id,
            name: roomUserClient.userClient.user.name,
            figureConfiguration: roomUserClient.userClient.user.figureConfiguration,

            position: roomUserClient.position,
            direction: roomUserClient.direction
        };
    }

    private getFurnitureData(furniture: RoomFurnitureItem): RoomFurnitureData {
        return {
            id: furniture.roomFurniture.id,
            furniture: furniture.roomFurniture.furniture,
            position: furniture.roomFurniture.position,
            direction: furniture.roomFurniture.direction,
            animation: furniture.roomFurniture.animation
        };
    }

    private sendRoomEvent(outgoingEvents: OutgoingEvent | OutgoingEvent[]) {
        this.users.forEach((user) => {
            user.userClient.send(outgoingEvents);
        });
    }

    private userLeftRoom(client: UserClient) {
        const user = this.getRoomUser(client);

        this.users.splice(this.users.indexOf(user), 1);

        this.sendRoomEvent(new OutgoingEvent<UserLeftRoom>("UserLeftRoom", {
            userId: user.userClient.user.id
        }));

        // TODO: dispose room instance
    }

    private userStartWalking(client: UserClient, event: StartWalking) {
        const user = this.getRoomUser(client);

        console.log(client.user.name + ": start walking from " + JSON.stringify(user.position));
        console.log(client.user.name + ": start walking to " + JSON.stringify(event.target));

        const rows = this.room.structure.grid.map((row) => {
                    return row.split('').map((column) => {
                        if(column === 'X') {
                            return 1;
                        }

                        return 0;
                    });
                });

        const columns = rows[0]!.map((_, colIndex) => rows.map(row => row[colIndex]!));

        const astarFinder = new AStarFinder({
            grid: {
                matrix: columns
            }
        });

        const result = astarFinder.findPath({
            x: user.position.row,
            y: user.position.column,
        }, {
            x: event.target.row,
            y: event.target.column,
        });

        const path = result.map((position) => {
            return {
                row: position[0]!,
                column: position[1]!
            }
        });

        path.splice(0, 1);

        user.path = path;

        console.log("Result: " + JSON.stringify(path));

        this.prepareActionsInterval();
    }

    private getRoomUser(client: UserClient) {
        const user = this.users.find((user) => user.userClient.user.id === client.user.id);

        if(!user) {
            throw new Error("User does not exist in room.");
        }

        return user;
    }

    private prepareActionsInterval() {
        if(this.actionsInterval === undefined) {
            this.actionsInterval = setInterval(this.handleActionsInterval.bind(this), 500);

            this.handleActionsInterval();
        }
    }

    private handleActionsInterval() {
        let shouldContinueInterval = false;

        const outgoingEvents: OutgoingEvent[] = [];

        const usersWithPath = this.users.filter((user) => user.path?.length);

        // TODO: change so that the clients get the full path immediately, and only use this interval to cancel due to obstructions in the path?
        for(let user of usersWithPath) {
            const nextPosition = user.path![0]!;

            const depth = parseInt(this.room.structure.grid[nextPosition.row]![nextPosition.column]!);

            const position = {
                row: nextPosition.row,
                column: nextPosition.column,
                depth
            };

            outgoingEvents.push(new OutgoingEvent<UserWalkTo>("UserWalkTo", {
                userId: user.userClient.user.id,
                from: user.position,
                to: position
            }));

            user.path!.splice(0, 1);
            user.position = position;

            if(user.path!.length) {
                shouldContinueInterval = true;
            }
        }

        if(outgoingEvents.length) {
            this.sendRoomEvent(outgoingEvents);
        }

        if(!shouldContinueInterval) {
            clearInterval(this.actionsInterval);

            delete this.actionsInterval;
        }
    }
}

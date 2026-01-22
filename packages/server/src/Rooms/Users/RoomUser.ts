import { RoomPosition } from "@shared/Interfaces/Room/RoomPosition.js";
import User from "../../Users/User.js";
import Room from "../Room.js";
import OutgoingEvent from "../../Events/Interfaces/OutgoingEvent.js";
import { UserLeftRoomEventData } from "@shared/Communications/Responses/Rooms/Users/UserLeftRoomEventData.js";
import { UserEnteredRoomEventData } from "@shared/Communications/Responses/Rooms/Users/UserEnteredRoomEventData.js";
import { RoomUserData } from "@shared/Interfaces/Room/RoomUserData.js";
import { UserWalkToEventData } from "@shared/Communications/Responses/Rooms/Users/UserWalkToEventData.js";
import { LoadRoomEventData } from "@shared/Communications/Responses/Rooms/LoadRoomEventData.js";

export default class RoomUser {
    public position: RoomPosition;
    public direction: number;

    public path?: Omit<RoomPosition, "depth">[];

    constructor(private readonly room: Room, public readonly user: User) {
        this.user.room = room;

        this.position = {
            row: room.model.structure.door?.row ?? 0,
            column: room.model.structure.door?.column ?? 0,
            depth: parseInt(room.model.structure.grid[room.model.structure.door?.row ?? 0]?.[room.model.structure.door?.column ?? 0]!)
        };

        this.direction = 2;

        this.addEventListeners();

        const userEnteredRoomEvent = new OutgoingEvent<UserEnteredRoomEventData>("UserEnteredRoomEvent", this.getRoomUserData());
        
        this.room.sendRoomEvent(userEnteredRoomEvent);
        
        this.user.send([
            new OutgoingEvent<LoadRoomEventData>("LoadRoomEvent", {
                structure: this.room.model.structure,
                users: this.room.users.map((user) => user.getRoomUserData()),
                furnitures: this.room.furnitures.map((furniture) => furniture.getFurnitureData())
            }),
            userEnteredRoomEvent
        ]);
    }
    
    private getRoomUserData(): RoomUserData {
        return {
            id: this.user.model.id,
            name: this.user.model.name,
            figureConfiguration: this.user.model.figureConfiguration,

            position: this.position,
            direction: this.direction
        };
    }

    private addEventListeners() {
        this.user.addListener("close", this.disconnectListener);
    }

    private removeEventListeners() {
        this.user.removeListener("close", this.disconnectListener);
    }

    public handleActionsInterval() {
        const nextPosition = this.path?.[0];
        
        if(!nextPosition) {
            return [];
        }

        const furniture = this.room.getUpmostFurnitureAtPosition(nextPosition);

        if(furniture) {
            if(!furniture.isWalkable()) {
                this.path = [];

                return [];
            }
        }

        const depth = this.room.getUpmostDepthAtPosition(nextPosition, furniture);

        const position = {
            row: nextPosition.row,
            column: nextPosition.column,
            depth
        };

        const outgoingEvents: OutgoingEvent[] = [];

        outgoingEvents.push(new OutgoingEvent<UserWalkToEventData>("UserWalkToEvent", {
            userId: this.user.model.id,
            from: this.position,
            to: position
        }));

        this.position = position;
        this.path!.splice(0, 1);

        return outgoingEvents;
    }

    private readonly disconnectListener = this.disconnect.bind(this);
    public disconnect() {
        this.removeEventListeners();
        
        this.room.users.splice(this.room.users.indexOf(this), 1);

        this.room.sendRoomEvent(new OutgoingEvent<UserLeftRoomEventData>("UserLeftRoomEvent", {
            userId: this.user.model.id
        }));

        delete this.user.room;

        this.user.send(new OutgoingEvent("LeaveRoomEvent", null));
    }
}

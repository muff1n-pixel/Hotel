import { UseRoomFurnitureEventData } from "@shared/Communications/Requests/Rooms/Furniture/UseRoomFurnitureEventData.js";
import RoomUser from "../../Users/RoomUser.js";
import RoomFurniture from "../RoomFurniture.js";
import RoomFurnitureLogic from "./Interfaces/RoomFurnitureLogic.js";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import { MoveRoomFurnitureEventData } from "@shared/Communications/Responses/Rooms/Furniture/MoveRoomFurnitureEventData.js";
import { RoomFurnitureEventData } from "@shared/Communications/Responses/Rooms/Furniture/RoomFurnitureEventData.js";
import { UserPositionEventData } from "@shared/Communications/Responses/Rooms/Users/UserPositionEventData.js";

export default class RoomFurnitureRollerLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {

    }

    private lastExecution: number = 0;

    private preoccupiedUsers: RoomUser[] = [];
    private preoccupiedFurniture: RoomFurniture[] = [];

    async use(roomUser: RoomUser, event: UseRoomFurnitureEventData): Promise<void> {
        // do nothing, since the roller is used automatically
        // but do display a use button in the client to show it's an interactable
    }

    async handleActionsInterval(): Promise<void> {
        const elapsedSinceLastExecution = performance.now() - this.lastExecution;

        if(elapsedSinceLastExecution < 1000) {
            return;
        }

        this.lastExecution = performance.now();

        const room = this.roomFurniture.room;

        const outgoingEvents: OutgoingEvent[] = [];

        const offsetPosition = this.roomFurniture.getOffsetPosition(1);

        const blockingUser = room.getRoomUserAtPosition(offsetPosition);

        for(let user of this.preoccupiedUsers) {
            user.preoccupiedByActionHandler = false;
        }
        
        for(let furniture of this.preoccupiedFurniture) {
            furniture.preoccupiedByActionHandler = false;
        }

        this.preoccupiedUsers = [];
        this.preoccupiedFurniture = [];

        if(!blockingUser) {
            const usersInteractingWithRoller = room.users.filter((user) => user.position.row === this.roomFurniture.model.position.row && user.position.column === this.roomFurniture.model.position.column);
            const furnitureInteractingWithRoller = room.getAllFurnitureAtPosition(this.roomFurniture.model.position);

            for(const user of usersInteractingWithRoller) {
                if(user.preoccupiedByActionHandler) {
                    continue;
                }

                const nextFurniture = room.getUpmostFurnitureAtPosition(offsetPosition);
                
                if(nextFurniture && !nextFurniture.isWalkable()) {
                    continue;
                }

                user.preoccupiedByActionHandler = true;
                this.preoccupiedUsers.push(user);

                const nextRoller = room.getAllFurnitureAtPosition(offsetPosition).find((furniture) => furniture.model.furniture.category === "roller");

                if(nextRoller) {
                    offsetPosition.depth = nextRoller.model.position.depth + nextRoller.model.furniture.dimensions.depth;
                }
                else {
                    offsetPosition.depth = parseInt(room.model.structure.grid[offsetPosition.row ?? 0]?.[offsetPosition.column ?? 0] ?? "0");
                }

                user.position = offsetPosition;

                user.path = undefined;
                user.pathOnCancel?.();

                outgoingEvents.push(new OutgoingEvent<UserPositionEventData>("UserPositionEvent", {
                    userId: user.user.model.id,
                    position: user.position,
                    usePath: true
                }));
            }

            for(const furniture of furnitureInteractingWithRoller) {
                if(furniture.preoccupiedByActionHandler) {
                    continue;
                }

                furniture.preoccupiedByActionHandler = true;
                this.preoccupiedFurniture.push(furniture);

                // do not move the roller itself
                if(furniture.model.id === this.roomFurniture.model.id) {
                    continue;
                }

                const offsetPosition = furniture.getOffsetPosition(1, this.roomFurniture.model.direction);

                const nextRoller = room.getAllFurnitureAtPosition(offsetPosition).find((furniture) => furniture.model.furniture.category === "roller");

                if(!nextRoller) {
                    // remove the depth of the roller
                    offsetPosition.depth -= this.roomFurniture.model.furniture.dimensions.depth;
                }

                furniture.model.position = offsetPosition;
        
                await furniture.model.save();
        
                outgoingEvents.push(new OutgoingEvent<MoveRoomFurnitureEventData>("MoveRoomFurnitureEvent", {
                    id: furniture.model.id,
                    position: offsetPosition
                }));
            }
        }

        if(outgoingEvents.length > 0) {
            room.outgoingEvents.push(...outgoingEvents);
            
            if(this.roomFurniture.model.animation !== 2) {
                this.roomFurniture.model.animation = 2;
                
                room.outgoingEvents.push(new OutgoingEvent<RoomFurnitureEventData>("RoomFurnitureEvent", {
                    furnitureUpdated: [
                        this.roomFurniture.getFurnitureData()
                    ]
                }));
            }
        }
        else if(this.roomFurniture.model.animation !== 0) {
            this.roomFurniture.model.animation = 0;
            
            room.outgoingEvents.push(new OutgoingEvent<RoomFurnitureEventData>("RoomFurnitureEvent", {
                furnitureUpdated: [
                    this.roomFurniture.getFurnitureData()
                ]
            }));
        }
    }
}
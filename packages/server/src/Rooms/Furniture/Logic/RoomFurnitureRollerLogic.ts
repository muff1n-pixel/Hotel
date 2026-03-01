import RoomUser from "../../Users/RoomUser.js";
import RoomFurniture from "../RoomFurniture.js";
import RoomFurnitureLogic from "./Interfaces/RoomFurnitureLogic.js";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import { RoomFurnitureData, RoomFurnitureMovedData, RoomPositionData, RoomPositionOffsetData, UseRoomFurnitureData } from "@pixel63/events";

export default class RoomFurnitureRollerLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {

    }

    private lastExecution: number = 0;

    async use(roomUser: RoomUser, payload: UseRoomFurnitureData): Promise<void> {
        // do nothing, since the roller is used automatically
        // but do display a use button in the client to show it's an interactable
    }

    async handleActionsInterval(): Promise<void> {
        const room = this.roomFurniture.room;

        if(this.roomFurniture.model.animation !== 0) {
            this.roomFurniture.model.animation = 0;

            room.sendProtobuff(RoomFurnitureData, RoomFurnitureData.fromJSON({
                furnitureUpdated: [
                    this.roomFurniture.model
                ]
            }));
        }

        if(room.model.speed === 0) {
            return;
        }

        const elapsedSinceLastExecution = performance.now() - this.lastExecution;

        if(elapsedSinceLastExecution < (1000 / room.model.speed)) {
            return;
        }

        this.lastExecution = performance.now();

        let animate = false;

        const offset = this.roomFurniture.getOffsetPosition(1);

        const blockingUser = room.getRoomUserAtPosition(offset);

        if(!blockingUser) {
            const usersInteractingWithRoller = room.users.filter((user) => user.position.row === this.roomFurniture.model.position.row && user.position.column === this.roomFurniture.model.position.column);
            const furnitureInteractingWithRoller = room.getAllFurnitureAtPosition(RoomPositionOffsetData.fromJSON(this.roomFurniture.model.position)).filter((furniture) => furniture.model.position.depth >= (this.roomFurniture.model.position.depth + this.roomFurniture.model.furniture.dimensions.depth));

            for(const user of usersInteractingWithRoller) {
                if(user.preoccupiedByActionHandler) {
                    continue;
                }

                if(user.path) {
                    continue;
                }
        
                const offsetPosition = RoomPositionData.fromJSON(offset);

                const nextFurniture = room.getUpmostFurnitureAtPosition(offset);
                
                if(nextFurniture && !nextFurniture.isWalkable(true)) {
                    continue;
                }

                user.preoccupiedByActionHandler = true;

                const nextRoller = room.getAllFurnitureAtPosition(offset).find((furniture) => furniture.model.furniture.category === "roller");

                if(nextRoller) {
                    offsetPosition.depth = nextRoller.model.position.depth + nextRoller.model.furniture.dimensions.depth;
                }
                else {
                    offsetPosition.depth = parseInt(room.model.structure.grid[offsetPosition.row ?? 0]?.[offsetPosition.column ?? 0] ?? "0");
                }

                user.position = offsetPosition;

                user.sendPositionEvent(true);
                
                animate = true;
            }

            for(const furniture of furnitureInteractingWithRoller) {
                if(furniture.preoccupiedByActionHandler) {
                    continue;
                }

                furniture.preoccupiedByActionHandler = true;

                // do not move the roller itself
                if(furniture.model.id === this.roomFurniture.model.id) {
                    continue;
                }

                const offset = furniture.getOffsetPosition(1, this.roomFurniture.model.direction);
                const offsetPosition = RoomPositionData.fromJSON(offset);

                const nextRoller = room.getAllFurnitureAtPosition(offset).find((furniture) => furniture.model.furniture.category === "roller");

                if(!nextRoller) {
                    // remove the depth of the roller
                    offsetPosition.depth -= this.roomFurniture.model.furniture.dimensions.depth;
                }

                furniture.setPosition(offsetPosition, false);
                
                await furniture.model.save();

                this.roomFurniture.room.sendProtobuff(RoomFurnitureMovedData, RoomFurnitureMovedData.create({
                    id: furniture.model.id,
                    position: offsetPosition
                }));
                
                animate = true;
            }
        }

        if(animate) {
            if(this.roomFurniture.model.animation !== 2) {
                this.roomFurniture.model.animation = 2;
                
                room.sendProtobuff(RoomFurnitureData, RoomFurnitureData.fromJSON({
                    furnitureUpdated: [
                        this.roomFurniture.model
                    ]
                }));
            }
        }
    }
}
import RoomUser from "../../Users/RoomUser.js";
import RoomFurniture from "../RoomFurniture.js";
import RoomFurnitureLogic from "./Interfaces/RoomFurnitureLogic.js";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import { RoomFurnitureData, RoomFurnitureMovedData, RoomPositionData, RoomPositionOffsetData, UseRoomFurnitureData } from "@pixel63/events";
import RoomFloorplanHelper from "../../RoomFloorplanHelper.js";

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
            await this.roomFurniture.setAnimation(0);
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

        const nextPosition = this.getNextPosition();

        if(this.isNextPositionBlocked(RoomPositionOffsetData.fromJSON(nextPosition))) {
            return;
        }

        const usersInteractingWithRoller = room.users.filter((user) => user.position.row === this.roomFurniture.model.position.row && user.position.column === this.roomFurniture.model.position.column);
        const furnitureInteractingWithRoller = room.furnitures.filter((furniture) => furniture.model.position.row === this.roomFurniture.model.position.row && furniture.model.position.column === this.roomFurniture.model.position.column && furniture.model.position.depth > (this.roomFurniture.model.position.depth + this.roomFurniture.model.furniture.dimensions.depth));

        for(const user of usersInteractingWithRoller) {
            if(user.preoccupiedByActionHandler) {
                continue;
            }

            if(user.path.path) {
                continue;
            }
            

            const offsetPosition = RoomPositionOffsetData.fromJSON(nextPosition);
            
            const furniture = this.roomFurniture.room.getUpmostFurnitureAtPosition(offsetPosition);
            const depth = this.roomFurniture.room.getUpmostDepthAtPosition(offsetPosition, furniture);

            if(depth === null) {
                continue;
            }
            
            user.preoccupiedByActionHandler = true;

            const position = RoomPositionData.create({
                row: nextPosition.row,
                column: nextPosition.column,
                depth
            });

            user.position = position;

            user.sendPositionEvent(true);
            
            animate = true;
        }

        for(const furniture of furnitureInteractingWithRoller) {
            if(furniture.preoccupiedByActionHandler) {
                continue;
            }

            furniture.preoccupiedByActionHandler = true;

            const position = RoomPositionData.create({
                row: nextPosition.row,
                column: nextPosition.column,
                depth: nextPosition.depth + (furniture.model.position.depth - this.roomFurniture.model.position.depth - this.roomFurniture.model.furniture.dimensions.depth)
            });

            await furniture.setPosition(position, false);
            
            await furniture.model.save();

            this.roomFurniture.room.sendProtobuff(RoomFurnitureMovedData, RoomFurnitureMovedData.create({
                id: furniture.model.id,
                position
            }));
            
            animate = true;
        }

        if(animate) {
            if(this.roomFurniture.model.animation !== 2) {
                this.roomFurniture.model.animation = 2;
                
                room.sendProtobuff(RoomFurnitureData, RoomFurnitureData.fromJSON({
                    furnitureUpdated: [
                        {
                            furniture: this.roomFurniture.model
                        }
                    ]
                }));
            }
        }
    }

    private getNextPosition() {
        const nextPosition = this.roomFurniture.getOffsetPosition(1);

        const nextRoller = this.getNextRoller(nextPosition);

        if(nextRoller) {
            return RoomPositionData.create({
                row: nextRoller.model.position.row,
                column: nextRoller.model.position.column,
                depth: nextRoller.model.position.depth + nextRoller.model.furniture.dimensions.depth,
            });
        }
        
        return RoomPositionData.create({
            row: nextPosition.row,
            column: nextPosition.column,
            depth: this.roomFurniture.model.position.depth,
        });
    }

    private getNextRoller(position: RoomPositionOffsetData) {
        return this.roomFurniture.room.furnitures.find((furniture) => furniture.model.position.row === position.row && furniture.model.position.column === position.column && furniture.logic instanceof RoomFurnitureRollerLogic);
    }

    private isNextPositionBlocked(position: RoomPositionOffsetData) {
        if(!this.roomFurniture.room.model.structure.grid[position.row]?.[position.column] || this.roomFurniture.room.model.structure.grid[position.row]?.[position.column] === 'X') {
            return true;
        }

        const nextRoller = this.getNextRoller(position);

        if(nextRoller) {
            const furnitureAtopNextRoller = this.roomFurniture.room.furnitures.some((furniture) => furniture.model.position.row === position.row && furniture.model.position.column === position.column && furniture.model.position.depth > nextRoller.model.position.depth);

            if(furnitureAtopNextRoller) {
                return true;
            }
        }

        if(this.roomFurniture.room.getActorAtPosition(position)) {
            return true;
        }

        return false;
    }
}
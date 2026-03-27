import { RoomFurnitureMovedData, RoomPositionData, RoomPositionOffsetData, UseRoomFurnitureData } from "@pixel63/events";
import RoomUser from "../../../Users/RoomUser.js";
import RoomFurniture from "../../RoomFurniture.js";
import RoomFurnitureLogic from "./../Interfaces/RoomFurnitureLogic.js";

export default class RoomFurnitureFootballLogic implements RoomFurnitureLogic {
    private travelingDirection: number | null = null;
    private travelingVelocity: number | null = null;
    private travelingPassing: boolean | null = null;
    private triggeringUser: RoomUser | null = null;

    private travelingInterval: NodeJS.Timeout | null = null;

    constructor(public readonly roomFurniture: RoomFurniture) {

    }

    async handleBeforeUserWalksOn(roomUser: RoomUser, previousRoomFurniture: RoomFurniture[]): Promise<void> {
        this.travelingDirection = roomUser.direction;
        this.travelingPassing = Boolean(roomUser.path.path && roomUser.path.path.length > 0);
        this.travelingVelocity = (this.travelingPassing)?(2):(6);
        this.triggeringUser = roomUser;

        this.moveFurniture().catch(console.error);
    }

    async use(roomUser: RoomUser, payload: UseRoomFurnitureData): Promise<void> {

    }

    async handleActionsInterval(): Promise<void> {
    }

    async moveFurniture() {
        if(this.travelingInterval !== null) {
            clearTimeout(this.travelingInterval);
            
            this.travelingInterval = null;
        }

        if(this.travelingVelocity !== null && this.travelingDirection !== null) {
            this.travelingVelocity--;

            if(this.travelingVelocity === 0) {
                this.travelingVelocity = null;
                this.travelingDirection = null;
                
                this.handleFootballStopped().catch(console.error);

                if(this.travelingInterval !== null) {
                    clearTimeout(this.travelingInterval);

                    this.travelingInterval = null;
                }

                return;
            }

            let nextOffsetPosition = this.roomFurniture.getOffsetPosition(1, this.travelingDirection);

            if(!this.isPositionValid(nextOffsetPosition)) {
                const originalTravelingDirection = this.travelingDirection;

                if((this.travelingDirection % 2) !== 0) {
                    this.travelingDirection += 2;
                    
                    this.travelingDirection %= 8;
            
                    nextOffsetPosition = this.roomFurniture.getOffsetPosition(1, this.travelingDirection);
                }
                
                if(!this.isPositionValid(nextOffsetPosition)) {
                    this.travelingDirection -= 4;
                    
                    this.travelingDirection %= 8;
                }
                
                if(!this.isPositionValid(nextOffsetPosition)) {
                    this.travelingDirection = originalTravelingDirection + 4;
                    this.travelingDirection %= 8;
                }
            
                nextOffsetPosition = this.roomFurniture.getOffsetPosition(1, this.travelingDirection);
                
                if(!this.isPositionValid(nextOffsetPosition)) {
                    this.travelingVelocity = 0;
                
                    this.handleFootballStopped().catch(console.error);

                    return;
                }
            }

            const nextFurniture = this.roomFurniture.room.getUpmostFurnitureAtPosition(nextOffsetPosition);
 
            const position = RoomPositionData.create({
                row: nextOffsetPosition.row,
                column: nextOffsetPosition.column,
                depth: this.roomFurniture.room.getUpmostDepthAtPosition(nextOffsetPosition, nextFurniture) + 0.0001
            });

            await this.roomFurniture.setPosition(position, false);
                            
            await this.roomFurniture.model.save();

            const duration = (this.travelingPassing)?(500):(1000 / this.travelingVelocity);

            this.roomFurniture.room.sendProtobuff(RoomFurnitureMovedData, RoomFurnitureMovedData.create({
                id: this.roomFurniture.model.id,
                position: position,
                duration
            }));

            if(this.travelingVelocity === 0) {
                this.travelingVelocity = null;
                this.travelingDirection = null;
                this.triggeringUser = null;
                
                this.handleFootballStopped().catch(console.error);
            }
            else {
                this.travelingInterval = setTimeout(() => {
                    this.moveFurniture().catch(console.error);
                }, duration);
            }

            this.handleFootballMoved(this.triggeringUser, position).catch(console.error);
        }
    }

    public async handleFootballMoved(user: RoomUser | null, position: RoomPositionData) {

    }

    public async handleFootballStopped() {

    }

    private isPositionValid(position: RoomPositionOffsetData) {
        const floorplanDepth = this.roomFurniture.room.model.structure.grid[position.row]?.[position.column];

        if(!floorplanDepth || floorplanDepth === 'X') {
            return false;
        }

        const nextFurniture = this.roomFurniture.room.getUpmostFurnitureAtPosition(position);

        if(nextFurniture && (!nextFurniture.model.furniture.flags.walkable || (nextFurniture.logic?.isWalkable && !nextFurniture.logic.isWalkable()))) {
            return false;
        }

        return true;
    }
}

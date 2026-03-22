import { RoomFurnitureMovedData, RoomPositionData, UseRoomFurnitureData } from "@pixel63/events";
import RoomUser from "../../../Users/RoomUser.js";
import RoomFurniture from "../../RoomFurniture.js";
import RoomFurnitureLogic from "./../Interfaces/RoomFurnitureLogic.js";

export default class RoomFurnitureFootballLogic implements RoomFurnitureLogic {
    private travelingDirection: number | null = null;
    private travelingVelocity: number | null = null;
    private travelingPassing: boolean | null = null;

    private travelingInterval: NodeJS.Timeout | null = null;

    constructor(private readonly roomFurniture: RoomFurniture) {

    }

    async handleUserWalksOn(roomUser: RoomUser, previousRoomFurniture: RoomFurniture[]): Promise<void> {
        this.travelingDirection = roomUser.direction;
        this.travelingPassing = Boolean(roomUser.path.path && roomUser.path.path.length > 0);
        this.travelingVelocity = (this.travelingPassing)?(2):(6);

        this.moveFurniture();
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

                if(this.travelingInterval !== null) {
                    clearTimeout(this.travelingInterval);

                    this.travelingInterval = null;
                }

                return;
            }

            let nextOffsetPosition = this.roomFurniture.getOffsetPosition(1, this.travelingDirection);
            const floorplanDepth = this.roomFurniture.room.model.structure.grid[nextOffsetPosition.row]?.[nextOffsetPosition.column];

            if(!floorplanDepth || floorplanDepth === 'X') {
                this.travelingDirection += 4;
                this.travelingDirection %= 8;
            
                nextOffsetPosition = this.roomFurniture.getOffsetPosition(1, this.travelingDirection);
            }

            const nextFurniture = this.roomFurniture.room.getUpmostFurnitureAtPosition(nextOffsetPosition);

            if(nextFurniture && !nextFurniture.model.furniture.flags.stackable) {
                this.travelingDirection += 4;
                this.travelingDirection %= 8;
            }
 
            const position = RoomPositionData.create({
                row: nextOffsetPosition.row,
                column: nextOffsetPosition.column,
                depth: this.roomFurniture.room.getUpmostDepthAtPosition(nextOffsetPosition, nextFurniture) + 0.0001
            });

            this.roomFurniture.setPosition(position, false);
                            
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
            }
            else {
                this.travelingInterval = setTimeout(() => {
                    this.moveFurniture();
                }, duration);
            }
        }
    }
}

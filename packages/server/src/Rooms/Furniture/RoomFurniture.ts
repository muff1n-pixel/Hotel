import Room from "../Room.js";
import { UserFurnitureModel } from "../../Database/Models/Users/Furniture/UserFurnitureModel.js";
import { RoomFurnitureData } from "@shared/Interfaces/Room/RoomFurnitureData.js";
import OutgoingEvent from "../../Events/Interfaces/OutgoingEvent.js";
import { RoomFurnitureEventData } from "@shared/Communications/Responses/Rooms/Furniture/RoomFurnitureEventData.js";
import { RoomPosition } from "@shared/Interfaces/Room/RoomPosition.js";
import { game } from "../../index.js";
import RoomFurnitureTeleportLogic from "./Logic/RoomFurnitureTeleportLogic.js";
import RoomFurnitureGateLogic from "./Logic/RoomFurnitureGateLogic.js";
import RoomFurnitureLightingLogic from "./Logic/RoomFurnitureLightingLogic.js";
import RoomFurnitureRollerLogic from "./Logic/RoomFurnitureRollerLogic.js";
import RoomFurnitureLogic from "./Logic/Interfaces/RoomFurnitureLogic.js";
import RoomFurnitureVendingMachineLogic from "./Logic/RoomFurnitureVendingMachineLogic.js";
import RoomFurnitureDiceLogic from "./Logic/RoomFurnitureDiceLogic.js";
import RoomFurnitureTeleportTileLogic from "./Logic/RoomFurnitureTeleportTileLogic.js";
import RoomUser from "../Users/RoomUser.js";
import RoomFurnitureFortunaLogic from "./Logic/RoomFurnitureFortunaLogic.js";

export default class RoomFurniture {
    public preoccupiedByActionHandler: boolean = false;

    constructor(public readonly room: Room, public readonly model: UserFurnitureModel) {
        if(model.furniture.category === "teleport") {
            model.animation = 0;
        }
    }

    public static async place(room: Room, userFurniture: UserFurnitureModel, position: RoomPosition, direction: number) {
        await userFurniture.update({
            position,
            direction,
            roomId: room.model.id
        });

        const roomFurniture = new RoomFurniture(room, userFurniture);

        room.furnitures.push(roomFurniture);

        room.floorplan.updatePosition(position, undefined, roomFurniture.getDimensions());

        room.sendRoomEvent(new OutgoingEvent<RoomFurnitureEventData>("RoomFurnitureEvent", {
            furnitureAdded: [
                roomFurniture.getFurnitureData()
            ]
        }));

        return roomFurniture;
    }

    public getFurnitureData(): RoomFurnitureData {
        return {
            id: this.model.id,
            userId: this.model.user.id,
            furniture: this.model.furniture,
            position: this.model.position,
            direction: this.model.direction,
            animation: this.model.animation,
            color: this.model.color,
            data: this.model.data
        };
    }

    public async pickup() {
        this.room.furnitures.splice(this.room.furnitures.indexOf(this), 1);

        this.room.floorplan.updatePosition(this.model.position, undefined, this.getDimensions());

        this.room.sendRoomEvent(new OutgoingEvent<RoomFurnitureEventData>("RoomFurnitureEvent", {
            furnitureRemoved: [
                {
                    id: this.model.id
                }
            ]
        }));

        await this.model.update({
            roomId: null
        });

        const user = game.getUserById(this.model.user.id);

        if(user) {
            user.getInventory().addFurniture(this.model);
        }
    }

    public isWalkable(finalDestination: boolean) {
        if(this.model.furniture.flags.walkable) {
            return true;
        }

        if(finalDestination) {
            // it can be walked through or used as final destination
            if(this.model.furniture.flags.sitable) {
                return true;
            }
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

    public getDimensions() {
        return (this.model.direction === 0 || this.model.direction === 4)?({
            row: this.model.furniture.dimensions.column,
            column: this.model.furniture.dimensions.row,
            depth: this.model.furniture.dimensions.depth,
        }):({
            row: this.model.furniture.dimensions.row,
            column: this.model.furniture.dimensions.column,
            depth: this.model.furniture.dimensions.depth,
        });
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

        const dimensions = this.getDimensions();

        if(this.model.position.row + dimensions.row <= position.row) {
            return false;
        }

        if(this.model.position.column + dimensions.column <= position.column) {
            return false;
        }

        return true;
    }

    public getData<T>() {
        return {...(this.model.data ?? {})} as T;
    }

    private category: RoomFurnitureLogic | null = null;

    public getCategoryLogic(): RoomFurnitureLogic | null {
        if(!this.category) {
            switch(this.model.furniture.interactionType) {
                case "dice":
                    return this.category = new RoomFurnitureDiceLogic(this);

                case "teleport":
                    return this.category = new RoomFurnitureTeleportLogic(this);

                case "teleporttile":
                    return this.category = new RoomFurnitureTeleportTileLogic(this);

                case "gate":
                    return this.category = new RoomFurnitureGateLogic(this);
                
                case "default":
                case "multiheight":
                    return this.category = new RoomFurnitureLightingLogic(this);
                
                case "vendingmachine":
                    return this.category = new RoomFurnitureVendingMachineLogic(this);

                case "roller":
                    return this.category = new RoomFurnitureRollerLogic(this);

                case "fortuna":
                    return this.category = new RoomFurnitureFortunaLogic(this);
            }

            if(!this.category) {
                console.warn("Unhandled intercation logic type: " + this.model.furniture.interactionType);
            }
        }

        return this.category;
    }

    public getOffsetPosition(offset: number, direction: number = this.model.direction) {
        const position = {...this.model.position};

        switch(direction) {
            case 0:
                position.row -= offset;
                break;

            case 2:
                position.column += offset;
                break;
            
            case 4:
                position.row += offset;
                break;
            
            case 6:
                position.column -= offset;
                break;
        }

        return position;
    }

    public async setAnimation(animation: number, save: boolean = true) {
        this.model.animation = animation;

        if(this.model.changed()) {
            await this.model.save();

            this.room.sendRoomEvent(new OutgoingEvent<RoomFurnitureEventData>("RoomFurnitureEvent", {
                furnitureUpdated: [
                    this.getFurnitureData()
                ]
            }));
        }
    }

    public async setPosition(position: RoomPosition, save: boolean = true) {
        const previousPosition = this.model.position;
        const previousSitPosition = this.getSitPosition();

        this.model.position = position;

        this.room.floorplan.updatePosition(position, previousPosition, this.getDimensions());

        if(this.model.furniture.flags.sitable) {
            const actorsAtPreviousPosition = this.room.getActorsAtPosition(previousPosition);
            const sitableFurnitureAtPreviousPosition = this.room.getSitableFurnitureAtPosition(previousPosition);

            if(sitableFurnitureAtPreviousPosition) {
                for(const actor of actorsAtPreviousPosition) {
                    actor.addAction("Sit");
                    actor.removeAction("Dance");
                    actor.path.setPosition(sitableFurnitureAtPreviousPosition.getSitPosition(), this.model.direction);
                }
            }
            else {
                for(const actor of actorsAtPreviousPosition) {
                    actor.removeAction("Sit");
                    actor.path.setPosition({
                        ...previousPosition,
                        depth: this.room.getUpmostDepthAtPosition(previousPosition)
                    }, this.model.direction);
                }
            }

            const actorsAtPosition = this.room.getActorsAtPosition(position);

            for(const actor of actorsAtPosition) {
                actor.addAction("Sit");
                actor.removeAction("Dance");
                actor.path.setPosition(this.getSitPosition(), this.model.direction);
            }
        }

        if(save && this.model.changed()) {
            await this.model.save();

            this.room.sendRoomEvent(new OutgoingEvent<RoomFurnitureEventData>("RoomFurnitureEvent", {
                furnitureUpdated: [
                    this.getFurnitureData()
                ]
            }));
        }
    }

    public getSitPosition() {
        return {
            ...this.model.position,
            depth: this.model.position.depth + this.model.furniture.dimensions.depth - 0.5
        };
    }

    public async setDirection(direction: number, save: boolean = true) {
        this.model.direction = direction;

        this.room.floorplan.updatePosition(this.model.position, undefined, this.getDimensions());

        if(this.model.furniture.flags.sitable) {
            const actorsAtPosition = this.room.getActorsAtPosition(this.model.position);

            for(const actor of actorsAtPosition) {
                actor.addAction("Sit");
                actor.path.setPosition(this.getSitPosition(), this.model.direction);
            }
        }

        if(save && this.model.changed()) {
            await this.model.save();

            this.room.sendRoomEvent(new OutgoingEvent<RoomFurnitureEventData>("RoomFurnitureEvent", {
                furnitureUpdated: [
                    this.getFurnitureData()
                ]
            }));
        }
    }

    public async userWalkOn(user: RoomUser) {
        const logic = this.getCategoryLogic();

        await logic?.walkOn?.(user);
    }

    public async handleActionsInterval() {
        const logic = this.getCategoryLogic();

        await logic?.handleActionsInterval();
    }
}

import Room from "../Room.js";
import { UserFurnitureModel } from "../../Database/Models/Users/Furniture/UserFurnitureModel.js";
import { game } from "../../index.js";
import RoomFurnitureLogic from "./Logic/Interfaces/RoomFurnitureLogic.js";
import RoomUser from "../Users/RoomUser.js";
import WiredTriggerStuffStateLogic from "./Logic/Wired/Trigger/WiredTriggerStuffStateLogic.js";
import { RoomFurnitureData, RoomPositionData, RoomPositionOffsetData, UserFurnitureAnimationTag, UserFurnitureCustomData } from "@pixel63/events";
import RoomFurnitureLogicFactory from "./RoomFurnitureLogicFactory.js";
import RoomFurnitureFreezeGateLogic from "./Logic/Games/Freeze/Common/RoomFurnitureFreezeGateLogic.js";
import Directions from "../../Helpers/Directions.js";
import RoomFurnitureStackHelperLogic from "./Logic/RoomFurnitureStackHelperLogic.js";

export default class RoomFurniture<T = unknown> {
    public preoccupiedByActionHandler: boolean = false;

    public readonly logic: RoomFurnitureLogic | null = null;

    constructor(public readonly room: Room, public readonly model: UserFurnitureModel) {
        if(model.furniture.category === "teleport") {
            model.animation = 0;
        }

        this.logic = RoomFurnitureLogicFactory.getLogic(this);
    }

    public static async place(room: Room, userFurniture: UserFurnitureModel, position: RoomPositionData, direction: number | null) {
        await userFurniture.update({
            position,
            direction,
            roomId: room.model.id
        });

        const roomFurniture = new RoomFurniture(room, userFurniture);

        room.furnitures.push(roomFurniture);

        room.floorplan.updatePosition(RoomPositionOffsetData.fromJSON(position), roomFurniture.getDimensions());

        room.sendProtobuff(RoomFurnitureData, RoomFurnitureData.fromJSON({
            furnitureData: [
                roomFurniture.model.furniture
            ],
            furnitureAdded: [
                roomFurniture.model
            ]
        }));

        if(roomFurniture.model.userId) {
            const userAchievements = game.getUserAchievements(roomFurniture.model.userId);

            if(roomFurniture.model.furniture.interactionType === "icetag_field") {
                userAchievements.addTotalAchievementScore("IceRinkBuilder", room.furnitures.filter((roomFurniture) => roomFurniture.model.furniture.interactionType === "icetag_field").length).catch(console.error);
            }
            else if(roomFurniture.model.furniture.type === "snowb_slope") {
                userAchievements.addTotalAchievementScore("SnowBoardBuilder", room.furnitures.filter((roomFurniture) => roomFurniture.model.furniture.type === "snowb_slope").length).catch(console.error);
            }
            else if(roomFurniture.model.furniture.type === "val11_floor") {
                userAchievements.addTotalAchievementScore("RollerRinkBuilder", room.furnitures.filter((roomFurniture) => roomFurniture.model.furniture.type === "val11_floor").length).catch(console.error);
            }
            else if(roomFurniture.model.furniture.interactionType === "bunnyrun_field") {
                userAchievements.addTotalAchievementScore("BunnyRunBuilder", room.furnitures.filter((roomFurniture) => roomFurniture.model.furniture.interactionType === "bunnyrun_field").length).catch(console.error);
            }

            userAchievements.addTotalAchievementScore("RoomBuilder", room.furnitures.length).catch(console.error);

            const uniqueFurniture = [...new Set(room.furnitures.map((roomFurniture) => roomFurniture.model.furniture.id))];
            
            userAchievements.addTotalAchievementScore("FurniCollector", uniqueFurniture.length).catch(console.error);
        }

        return roomFurniture;
    }

    public async pickup() {
        this.room.furnitures.splice(this.room.furnitures.indexOf(this), 1);

        this.room.floorplan.updatePosition(RoomPositionOffsetData.fromJSON(this.model.position), this.getDimensions());
        this.room.refreshActorsSitting(RoomPositionOffsetData.fromJSON(this.model.position), this.getDimensions());

        this.room.sendProtobuff(RoomFurnitureData, RoomFurnitureData.fromJSON({
            furnitureRemoved: [
                this.model
            ]
        }));

        await this.model.update({
            roomId: null
        });

        if(this.model.user) {
            const user = game.getUserById(this.model.user.id);

            if(user) {
                user.getInventory().addFurniture(this.model).catch(console.error);
            }
        }
    }

    public isWalkable(finalDestination: boolean) {
        if(this.logic?.isWalkable) {
            return this.logic.isWalkable();
        }

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

    public getDimensions(direction = this.model.direction) {
        return (direction === 0 || direction === 4)?(RoomPositionData.create({
            row: this.model.furniture.dimensions.column,
            column: this.model.furniture.dimensions.row,
            depth: this.model.furniture.dimensions.depth,
        })):(RoomPositionData.create({
            row: this.model.furniture.dimensions.row,
            column: this.model.furniture.dimensions.column,
            depth: this.model.furniture.dimensions.depth,
        }));
    }

    public isPositionInside(position: RoomPositionOffsetData) {
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

    public getOffsetPosition(offset: number, direction: number | null = this.model.direction): RoomPositionOffsetData {
        const position = {...this.model.position};

        if(direction === null) {
            return RoomPositionOffsetData.fromJSON(position);
        }

        switch(Directions.normalizeDirection(direction)) {
            case 0:
                position.row -= offset;
                break;

            case 1:
                position.row -= offset;
                position.column += offset;
                break;

            case 2:
                position.column += offset;
                break;

            case 3:
                position.row += offset;
                position.column += offset;
                break;
            
            case 4:
                position.row += offset;
                break;

            case 5:
                position.row += offset;
                position.column -= offset;
                break;
            
            case 6:
                position.column -= offset;
                break;

            case 7:
                position.row -= offset;
                position.column -= offset;
                break;
        }

        return RoomPositionOffsetData.fromJSON(position);
    }

    public async setAnimation(animation: number) {
        this.model.animation = animation;
        this.model.animationTags = null;

        if(this.model.changed()) {
            await this.model.save();
        }

        this.room.sendProtobuff(RoomFurnitureData, RoomFurnitureData.fromJSON({
            furnitureUpdated: [
                {
                    furniture: {
                        id: this.model.id,
                        animation: this.model.animation
                    }
                }
            ]
        }));

        this.room.floorplan.updatePosition(RoomPositionOffsetData.fromJSON(this.model.position), this.getDimensions());

        const wiredTriggerStuffStateLogics = this.room.getFurnitureWithCategory(WiredTriggerStuffStateLogic);

        for(const logic of wiredTriggerStuffStateLogics) {
            logic.handleFurnitureAnimationChange(this).catch(console.error);
        }
    }

    public async setAnimationTags(animationTags: UserFurnitureAnimationTag[]) {
        this.model.animation = 0;
        this.model.animationTags = animationTags;

        if(this.model.changed()) {
            await this.model.save();
        }

        this.room.sendProtobuff(RoomFurnitureData, RoomFurnitureData.fromJSON({
            furnitureUpdated: [
                {
                    furniture: {
                        id: this.model.id,
                        animationTags: this.model.animationTags
                    }
                }
            ]
        }));

        const wiredTriggerStuffStateLogics = this.room.getFurnitureWithCategory(WiredTriggerStuffStateLogic);

        for(const logic of wiredTriggerStuffStateLogics) {
            logic.handleFurnitureAnimationChange(this).catch(console.error);
        }
    }

    public async setPosition(position: RoomPositionData, save: boolean = true) {
        const previousPosition = this.model.position;
        const previousDimensions = this.getDimensions();

        this.model.position = position;

        if(this.logic instanceof RoomFurnitureStackHelperLogic) {
            this.model.data = UserFurnitureCustomData.create({
                stackHelper: {
                    height: this.model.position.depth
                }
            });
        }

        this.room.floorplan.updatePosition(RoomPositionOffsetData.fromJSON(position), this.getDimensions());
        this.room.floorplan.updatePosition(RoomPositionOffsetData.fromJSON(previousPosition), previousDimensions);

        if(this.model.furniture.flags.sitable) {
            this.room.refreshActorsSitting(RoomPositionOffsetData.fromJSON(previousPosition), previousDimensions);
            this.room.refreshActorsSitting(RoomPositionOffsetData.fromJSON(position), this.getDimensions());
        }

        if(save && this.model.changed()) {
            await this.model.save();

            this.room.sendProtobuff(RoomFurnitureData, RoomFurnitureData.fromJSON({
                furnitureUpdated: [
                    {
                        furniture: this.model
                    }
                ]
            }));
        }
    }

    public async setDirection(direction: number, save: boolean = true) {
        const previousDimensions = this.getDimensions();

        this.model.direction = direction;

        this.room.floorplan.updatePosition(RoomPositionOffsetData.fromJSON(this.model.position), previousDimensions);
        this.room.floorplan.updatePosition(RoomPositionOffsetData.fromJSON(this.model.position), this.getDimensions());

        if(this.model.furniture.flags.sitable) {
            this.room.refreshActorsSitting(RoomPositionOffsetData.fromJSON(this.model.position), previousDimensions);
            this.room.refreshActorsSitting(RoomPositionOffsetData.fromJSON(this.model.position), this.getDimensions());
        }

        if(save && this.model.changed()) {
            await this.model.save();

            this.room.sendProtobuff(RoomFurnitureData, RoomFurnitureData.fromJSON({
                furnitureUpdated: [
                    {
                        furniture: this.model
                    }
                ]
            }));
        }
    }

    /** Call this from the Room instance only. */
    public async handleUserWalksOnFurniture(roomUser: RoomUser, previousRoomFurniture: RoomFurniture[]) {
        await this.logic?.handleUserWalksOn?.(roomUser, previousRoomFurniture);
    }

    /** Call this from the Room instance only. */
    public async handleBeforeUserWalksOnFurniture(roomUser: RoomUser, previousRoomFurniture: RoomFurniture[]) {
        await this.logic?.handleBeforeUserWalksOn?.(roomUser, previousRoomFurniture);
    }

    /** Call this from the Room instance only. */
    public async handleUserWalksOffFurniture(roomUser: RoomUser, newRoomFurniture: RoomFurniture[]) {
        await this.logic?.handleUserWalksOff?.(roomUser, newRoomFurniture);
    }

    /** Call this from the Room instance only. */
    public async handleBeforeUserWalksOffFurniture(roomUser: RoomUser, newRoomFurniture: RoomFurniture[]) {
        await this.logic?.handleBeforeUserWalksOff?.(roomUser, newRoomFurniture);
    }

    public async handleActionsInterval() {
        await this.logic?.handleActionsInterval?.();
    }
}

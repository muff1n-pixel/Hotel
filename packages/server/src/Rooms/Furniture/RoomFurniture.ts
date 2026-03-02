import Room from "../Room.js";
import { UserFurnitureModel } from "../../Database/Models/Users/Furniture/UserFurnitureModel.js";
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
import WiredTriggerUserSaysSomethingLogic from "./Logic/Wired/Trigger/WiredTriggerUserSaysSomethingLogic.js";
import WiredActionShowMessageLogic from "./Logic/Wired/Action/WiredActionShowMessageLogic.js";
import WiredActionTeleportToLogic from "./Logic/Wired/Action/WiredActionTeleportToLogic.js";
import WiredTriggerUserEntersRoomLogic from "./Logic/Wired/Trigger/WiredTriggerUserEntersRoomLogic.js";
import WiredTriggerUserWalksOnFurnitureLogic from "./Logic/Wired/Trigger/WiredTriggerUserWalksOnFurnitureLogic.js";
import WiredTriggerUserWalksOffFurnitureLogic from "./Logic/Wired/Trigger/WiredTriggerUserWalksOffFurnitureLogic.js";
import WiredTriggerStateChangedLogic from "./Logic/Wired/Trigger/WiredTriggerStateChangedLogic.js";
import WiredTriggerStuffStateLogic from "./Logic/Wired/Trigger/WiredTriggerStuffStateLogic.js";
import WiredTriggerUserLeavesRoomLogic from "./Logic/Wired/Trigger/WiredTriggerUserLeavesRoomLogic.js";
import WiredTriggerUserClickFurniLogic from "./Logic/Wired/Trigger/WiredTriggerUserClickFurniLogic.js";
import WiredTriggerUserClickUserLogic from "./Logic/Wired/Trigger/WiredTriggerUserClickUserLogic.js";
import WiredTriggerUserClickTileLogic from "./Logic/Wired/Trigger/WiredTriggerUserClickTileLogic.js";
import RoomInvisibleFurnitureControlLogic from "./Logic/RoomInvisibleFurnitureControlLogic.js";
import WiredTriggerPeriodicallyLogic from "./Logic/Wired/Trigger/WiredTriggerPeriodicallyLogic.js";
import WiredTriggerUserPerformsActionLogic from "./Logic/Wired/Trigger/WiredTriggerUserPerformsActionLogic.js";
import WiredTriggerCollisionLogic from "./Logic/Wired/Trigger/WiredTriggerCollisionLogic.js";
import WiredActionSendSignalLogic from "./Logic/Wired/Action/WiredActionSendSignalLogic.js";
import WiredTriggerReceiveSignalLogic from "./Logic/Wired/Trigger/WiredTriggerReceiveSignalLogic.js";
import { RoomFurnitureData, RoomPositionData, RoomPositionOffsetData } from "@pixel63/events";

export default class RoomFurniture<T = unknown> {
    public preoccupiedByActionHandler: boolean = false;

    constructor(public readonly room: Room, public readonly model: UserFurnitureModel) {
        if(model.furniture.category === "teleport") {
            model.animation = 0;
        }
    }

    public static async place(room: Room, userFurniture: UserFurnitureModel, position: RoomPositionData, direction: number) {
        await userFurniture.update({
            position,
            direction,
            roomId: room.model.id
        });

        const roomFurniture = new RoomFurniture(room, userFurniture);

        room.furnitures.push(roomFurniture);

        room.floorplan.updatePosition(RoomPositionOffsetData.fromJSON(position), roomFurniture.getDimensions());

        room.sendProtobuff(RoomFurnitureData, RoomFurnitureData.fromJSON({
            furnitureAdded: [
                roomFurniture.model
            ]
        }));

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
        return (this.model.direction === 0 || this.model.direction === 4)?(RoomPositionData.create({
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
                
                case "conf_invis_control":
                    return this.category = new RoomInvisibleFurnitureControlLogic(this);

                case "wf_trg_says_something":
                    return this.category = new WiredTriggerUserSaysSomethingLogic(this);

                case "wf_trg_enter_room":
                    return this.category = new WiredTriggerUserEntersRoomLogic(this);

                case "wf_trg_leave_room":
                    return this.category = new WiredTriggerUserLeavesRoomLogic(this);

                case "wf_trg_walks_on_furni":
                    return this.category = new WiredTriggerUserWalksOnFurnitureLogic(this);

                case "wf_trg_walks_off_furni":
                    return this.category = new WiredTriggerUserWalksOffFurnitureLogic(this);

                case "wf_trg_state_changed":
                    return this.category = new WiredTriggerStateChangedLogic(this);

                case "wf_trg_stuff_state":
                    return this.category = new WiredTriggerStuffStateLogic(this);

                case "wf_trg_click_furni":
                    return this.category = new WiredTriggerUserClickFurniLogic(this);

                case "wf_trg_click_user":
                    return this.category = new WiredTriggerUserClickUserLogic(this);

                case "wf_trg_click_tile":
                    return this.category = new WiredTriggerUserClickTileLogic(this);

                case "wf_trg_periodically":
                case "wf_trg_period_short":
                case "wf_trg_period_long":
                    return this.category = new WiredTriggerPeriodicallyLogic(this);

                case "wf_trg_user_performs_action":
                    return this.category = new WiredTriggerUserPerformsActionLogic(this);

                case "wf_trg_collision":
                    return this.category = new WiredTriggerCollisionLogic(this);
                    
                case "wf_act_show_message":
                    return this.category = new WiredActionShowMessageLogic(this);

                case "wf_act_teleport_to":
                    return this.category = new WiredActionTeleportToLogic(this);

                case "wf_act_send_signal":
                    return this.category = new WiredActionSendSignalLogic(this);

                case "wf_trg_recv_signal":
                    return this.category = new WiredTriggerReceiveSignalLogic(this);
            }

            if(!this.category) {
                //console.warn("Unhandled intercation logic type: " + this.model.furniture.interactionType);
            }
        }

        return this.category;
    }

    public getOffsetPosition(offset: number, direction: number = this.model.direction): RoomPositionOffsetData {
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

        return RoomPositionOffsetData.fromJSON(position);
    }

    public async setAnimation(animation: number) {
        this.model.animation = animation;

        if(this.model.changed()) {
            await this.model.save();
        }

        this.room.sendProtobuff(RoomFurnitureData, RoomFurnitureData.fromJSON({
            furnitureUpdated: [
                this.model
            ]
        }));

        const wiredTriggerStuffStateLogics = this.room.getFurnitureWithCategory(WiredTriggerStuffStateLogic);

        for(const logic of wiredTriggerStuffStateLogics) {
            logic.handleFurnitureAnimationChange(this);
        }
    }

    public async setPosition(position: RoomPositionData, save: boolean = true) {
        const previousPosition = this.model.position;
        const previousDimensions = this.getDimensions();

        this.model.position = position;

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
                    this.model
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
                    this.model
                ]
            }));
        }
    }

    /** Call this from the Room instance only. */
    public async handleUserWalksOnFurniture(roomUser: RoomUser) {
        const logic = this.getCategoryLogic();

        await logic?.handleUserWalksOn?.(roomUser);
    }

    /** Call this from the Room instance only. */
    public async handleUserWalksOffFurniture(roomUser: RoomUser) {
        const logic = this.getCategoryLogic();

        await logic?.handleUserWalksOff?.(roomUser);
    }

    public async handleActionsInterval() {
        const logic = this.getCategoryLogic();

        await logic?.handleActionsInterval?.();
    }
}

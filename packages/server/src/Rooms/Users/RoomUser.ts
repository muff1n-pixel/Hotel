import User from "../../Users/User.js";
import Room from "../Room.js";
import OutgoingEvent from "../../Events/Interfaces/OutgoingEvent.js";
import RoomFloorplanHelper from "../RoomFloorplanHelper.js";
import { game } from "../../index.js";
import RoomActor from "../Actor/RoomActor.js";
import RoomFurniture from "../Furniture/RoomFurniture.js";
import RoomActorPath from "../Actor/Path/RoomActorPath.js";
import WiredTriggerUserLeavesRoomLogic from "../Furniture/Logic/Wired/Trigger/WiredTriggerUserLeavesRoomLogic.js";
import WiredTriggerUserPerformsActionLogic from "../Furniture/Logic/Wired/Trigger/WiredTriggerUserPerformsActionLogic.js";
import { LeaveRoomData, RoomActorActionData, RoomActorChatData, RoomActorPositionData, RoomActorWalkToData, RoomBellQueueData, RoomBellQueueUserData, RoomLoadData, RoomPositionData, RoomPositionOffsetData, RoomUserData, RoomUserEnteredData, RoomUserLeftData, UserData } from "@pixel63/events";
import { FurnitureModel } from "../../Database/Models/Furniture/FurnitureModel.js";
import { RoomActorAction } from "../Actor/RoomActorAction.js";
import Directions from "../../Helpers/Directions.js";

export default class RoomUser implements RoomActor {
    public preoccupiedByActionHandler: boolean = false;

    public path: RoomActorPath;
    
    public position: RoomPositionData;
    public direction: number;
    public actions: RoomActorAction[] = [];
    public typing: boolean = false;
    public teleporting: boolean = false;
    public idling: boolean = false;
    public ready: boolean = false;

    private _lastActivity: number = performance.now();

    public get lastActivity() {
        return this._lastActivity;
    }

    public set lastActivity(value: number) {
        this._lastActivity = value;

        if(this.idling) {
            this.idling = false;

            this.room.sendProtobuff(RoomUserData, RoomUserData.create({
                id: this.user.model.id,
                idling: false
            }));
        }
    }

    constructor(public readonly room: Room, public readonly user: User, initialPosition?: RoomPositionData) {
        this.user.room = room;

        this.position = initialPosition ?? {
            $type: "RoomPositionData",
            row: room.model.structure.door?.row ?? 0,
            column: room.model.structure.door?.column ?? 0,
            depth: RoomFloorplanHelper.parseDepth(room.model.structure.grid[room.model.structure.door?.row ?? 0]?.[room.model.structure.door?.column ?? 0] ?? '0')
        };

        this.user.room.floorplan.updatePosition(RoomPositionOffsetData.fromJSON(this.position));

        this.direction = room.model.structure.door?.direction ?? 2;

        this.addEventListeners();

        this.room.sendProtobuff(RoomUserEnteredData, RoomUserEnteredData.create({
            user: this.getRoomUserData()
        }));

        const uniqueFurniture: FurnitureModel[] = [];

        for(const userFurniture of this.room.furnitures) {
            if(uniqueFurniture.some((uniqueFurniture) => uniqueFurniture.id === userFurniture.model.furniture.id)) {
                continue;
            }

            uniqueFurniture.push(userFurniture.model.furniture);
        }

        this.user.sendProtobuff(RoomLoadData, RoomLoadData.fromJSON({
            id: this.room.model.id,
            
            information: this.room.getInformationData(),
            
            structure: this.room.model.structure,

            furniture: this.room.furnitures.map((furniture) => furniture.model),
            furnitureData: uniqueFurniture,
            
            users: this.room.users.map((user) => user.getRoomUserData()),
            bots: this.room.bots.map((bot) => bot.model),
            pets: this.room.pets.map((pet) => pet.model),

            hasRights: this.hasRights()
        }))
        
        this.user.sendProtobuff(RoomUserEnteredData, RoomUserEnteredData.create({
            user: this.getRoomUserData()
        }));

        this.path = new RoomActorPath(this);

        if(this.user.roomBellQueue) {
            const room = this.user.roomBellQueue;
            user.roomBellQueue = undefined;
            
            for(const roomUserWithRights of room.users.filter((user) => user.hasRights())) {
                roomUserWithRights.user.sendProtobuff(RoomBellQueueData, RoomBellQueueData.create({
                    users: game.users.filter((user) => user.roomBellQueue?.model.id === roomUserWithRights.room.model.id).map((user) => {
                        return RoomBellQueueUserData.create({
                            id: user.model.id,
                            name: user.model.name
                        })
                    })
                }));
            }
        }

        this.user.friends.updateFriends();
    }
    
    private getRoomUserData(): RoomUserData {
        return {
            $type: "RoomUserData",

            id: this.user.model.id,
            name: this.user.model.name,
            motto: this.user.model.motto ?? undefined,

            figureConfiguration: this.user.model.figureConfiguration,

            position: this.position,
            direction: this.direction,
            
            hasRights: this.hasRights(),
            actions: this.actions.map((action) => action.id),
            typing: this.typing,
            idling: this.idling
        };
    }

    private addEventListeners() {
        this.user.addListener("close", this.disconnectListener);
    }

    private removeEventListeners() {
        this.user.removeListener("close", this.disconnectListener);
    }

    public async handleActionsInterval() {
        if(!this.idling && (performance.now() - this.lastActivity) > 2 * 60 * 1000) {
            this.idling = true;

            this.room.sendProtobuff(RoomUserData, RoomUserData.create({
                id: this.user.model.id,
                idling: true
            }))
        }

        for(const action of this.actions) {
            if(action.expiresAt === undefined) {
                continue;
            }

            if(performance.now() > action.expiresAt) {
                this.removeAction(action.id);
            }
        }

        await this.path.handleActionsInterval();
    }

    private readonly disconnectListener = this.disconnect.bind(this);
    public disconnect() {
        this.removeEventListeners();
        
        this.room.users.splice(this.room.users.indexOf(this), 1);

        for(const game of this.room.games.getAllGames()) {
            game.players.removePlayer(this);
        }

        this.room.sendProtobuff(RoomUserLeftData, RoomUserLeftData.create({
            userId: this.user.model.id
        }));

        this.user.room?.floorplan.updatePosition(RoomPositionOffsetData.fromJSON(this.position));

        const furnitureWithUserLeftRoom = this.room.furnitures.filter((furniture) => furniture.logic?.handleUserLeftRoom !== undefined);

        for(const furniture of furnitureWithUserLeftRoom) {
            furniture.logic?.handleUserLeftRoom?.(this).catch(console.error);
        }

        delete this.user.room;

        this.user.sendProtobuff(LeaveRoomData, LeaveRoomData.create({}));

        if(!this.room.users.length) {
            game.roomManager.unloadRoom(this.room);
        }

        this.user.friends.updateFriends();
    }

    public hasAction(actionId: string): boolean {
        return this.actions.some((action) => action.id === actionId);
    }

    public addAction(action: string, removeAfterMs?: number, sendProtobuff?: boolean): RoomActorActionData | null {
        if(this.hasAction(action)) {
            return null;
        }

        if(action === "Sit") {
            if(this.direction % 2) {
                this.path.setDirection((this.direction + 1) % 8);
            }
        }

        if(["Wave", "GestureSmile", "GestureSad", "GestureAngry", "GestureSurprised", "Laugh"].includes(action)) {
            removeAfterMs = 2000;
        }

        this.actions.push({
            id: action,
            expiresAt: (removeAfterMs !== undefined)?(performance.now() + removeAfterMs):(undefined)
        });

        const roomActorActionData = RoomActorActionData.create({
            actor: {
                user: {
                    userId: this.user.model.id
                }
            },
            
            actionsAdded: [action]
        });

        if(sendProtobuff) {
            this.room.sendProtobuff(RoomActorActionData, roomActorActionData);
        }

        for(const logic of this.room.getFurnitureWithCategory(WiredTriggerUserPerformsActionLogic)) {
            logic.handleUserAction(this, action).catch(console.error);
        }

        return roomActorActionData;
    }

    public removeAction(action: string) {
        const actionId = action.split('.')[0]!;

        const existingActionIndex = this.actions.findIndex((action) => action.id.split('.')[0] === actionId);

        if(existingActionIndex === -1) {
            return;
        }

        this.actions.splice(existingActionIndex, 1);

        this.room.sendProtobuff(RoomActorActionData, RoomActorActionData.create({
            actor: {
                user: {
                    userId: this.user.model.id
                }
            },
            
            actionsRemoved: [actionId]
        }));
    }

    public sendWalkEvent(previousPosition: RoomPositionData, jump: boolean): void {
        this.room.sendProtobuff(RoomActorWalkToData, RoomActorWalkToData.create({
            actor: {
                user: {
                    userId: this.user.model.id
                }
            },
            from: previousPosition,
            to: this.position,
            direction: this.direction,
            jump
        }));
    }

    public sendDirectionEvent(): void {
        this.room.sendProtobuff(RoomActorPositionData, RoomActorPositionData.create({
            actor: {
                user: {
                    userId: this.user.model.id
                }
            },
            
            direction: this.direction,
        }));
    }

    public sendPositionEvent(usePath: boolean, roomActorActionsData?: RoomActorActionData | null) {
        this.room.sendProtobuff(RoomActorPositionData, RoomActorPositionData.create({
            actor: {
                user: {
                    userId: this.user.model.id
                }
            },
            
            position: this.position,
            direction: this.direction,
            usePath,

            action: roomActorActionsData ?? undefined
        }));
    }

    public getOffsetPosition(direction: number, offset: number) {
        const position = {...this.position};

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

        return position;
    }

    public hasRights() {
        if(this.user.permissions.hasPermission("room:rights")) {
            return true;
        }
        
        if(this.room.model.owner.id === this.user.model.id) {
            return true;
        }

        if(this.room.model.rights.some((rights) => rights.user.id === this.user.model.id)) {
            return true;
        }

        return false;
    }

    public sendRoomMessage(message: string) {
        this.room.sendProtobuff(RoomActorChatData, RoomActorChatData.create({
            actor: {
                user: {
                    userId: this.user.model.id
                }
            },
            
            message,
            roomChatStyleId: this.user.model.roomChatStyleId
        }));

        this.lastActivity = performance.now();
    }

    public async handleWalkEvent(previousPosition: RoomPositionOffsetData, newPosition: RoomPositionOffsetData) {
        const previousFurniture = this.room.furnitures.filter((furniture) => furniture.isPositionInside(previousPosition));
        const newFurniture = this.room.furnitures.filter((furniture) => furniture.isPositionInside(newPosition));

        for(const furniture of previousFurniture) {
            await this.handleWalksOffFurniture?.(furniture, newFurniture);
        }

        for(const furniture of newFurniture) {
            await this.handleWalksOnFurniture?.(furniture, previousFurniture);
        }
    }

    public async handleBeforeWalkEvent(previousPosition: RoomPositionOffsetData, newPosition: RoomPositionOffsetData) {
        const previousFurniture = this.room.furnitures.filter((furniture) => furniture.isPositionInside(previousPosition));
        const newFurniture = this.room.furnitures.filter((furniture) => furniture.isPositionInside(newPosition));

        for(const furniture of previousFurniture) {
            await this.handleBeforeWalksOffFurniture?.(furniture, newFurniture);
        }

        for(const furniture of newFurniture) {
            await this.handleBeforeWalksOnFurniture?.(furniture, previousFurniture);
        }
    }

    public async handleWalkToEvent(position: RoomPositionOffsetData) {
        const allFurniture = this.room.furnitures.filter((furniture) => furniture.isPositionInside(position));

        for(const furniture of allFurniture) {
            await furniture.logic?.handleUserWalksTo?.(this);
        }
    }

    public async handleBeforeWalksOnFurniture(roomFurniture: RoomFurniture, previousRoomFurniture: RoomFurniture[]): Promise<void> {
        return this.room.handleBeforeUserWalksOnFurniture(this, roomFurniture, previousRoomFurniture);
    }

    public async handleWalksOnFurniture(roomFurniture: RoomFurniture, previousRoomFurniture: RoomFurniture[]): Promise<void> {
        return this.room.handleUserWalksOnFurniture(this, roomFurniture, previousRoomFurniture);
    }

    public async handleWalksOffFurniture(roomFurniture: RoomFurniture, newRoomFurniture: RoomFurniture[]): Promise<void> {
        return this.room.handleUserWalksOffFurniture(this, roomFurniture, newRoomFurniture);
    }

    public async handleBeforeWalksOffFurniture(roomFurniture: RoomFurniture, newRoomFurniture: RoomFurniture[]): Promise<void> {
        return this.room.handleBeforeUserWalksOffFurniture(this, roomFurniture, newRoomFurniture);
    }

    public isWithinRadius(center: RoomPositionData, radius: number) {
        const distance = Math.max(
            Math.abs(this.position.column - center.column),
            Math.abs(this.position.row - center.row)
        );

        return distance <= radius;
    }
}

import { RoomPosition } from "@shared/Interfaces/Room/RoomPosition.js";
import User from "../../Users/User.js";
import Room from "../Room.js";
import OutgoingEvent from "../../Events/Interfaces/OutgoingEvent.js";
import { UserLeftRoomEventData } from "@shared/Communications/Responses/Rooms/Users/UserLeftRoomEventData.js";
import { UserEnteredRoomEventData } from "@shared/Communications/Responses/Rooms/Users/UserEnteredRoomEventData.js";
import { RoomUserData } from "@shared/Interfaces/Room/RoomUserData.js";
import { LoadRoomEventData } from "@shared/Communications/Responses/Rooms/LoadRoomEventData.js";
import { AStarFinder } from "astar-typescript";
import { RoomChatEventData } from "@shared/Communications/Responses/Rooms/Chat/RoomChatEventData.js";
import RoomFloorplanHelper from "../RoomFloorplanHelper.js";
import { game } from "../../index.js";
import { UserIdlingEventData } from "@shared/Communications/Responses/Rooms/Users/UserIdlingEventData.js";
import RoomActor from "../Actor/RoomActor.js";
import RoomFurniture from "../Furniture/RoomFurniture.js";
import RoomActorPath from "../Actor/Path/RoomActorPath.js";
import { ActorActionEventData } from "@shared/Communications/Responses/Rooms/Actors/ActorActionEventData.js";
import { ActorPositionEventData } from "@shared/Communications/Responses/Rooms/Actors/ActorPositionEventData.js";
import { ActorWalkToEventData } from "@shared/Communications/Responses/Rooms/Actors/ActorWalkToEventData.js";

export default class RoomUser implements RoomActor {
    public preoccupiedByActionHandler: boolean = false;

    public path: RoomActorPath;
    
    public position: RoomPosition;
    public direction: number;
    public actions: string[] = [];
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

            this.room.outgoingEvents.push(
                new OutgoingEvent<UserIdlingEventData>("UserIdlingEvent", {
                    userId: this.user.model.id,
                    idling: false
                })
            );
        }
    }

    constructor(public readonly room: Room, public readonly user: User, initialPosition?: RoomPosition) {
        this.user.room = room;

        this.position = initialPosition ?? {
            row: room.model.structure.door?.row ?? 0,
            column: room.model.structure.door?.column ?? 0,
            depth: RoomFloorplanHelper.parseDepth(room.model.structure.grid[room.model.structure.door?.row ?? 0]?.[room.model.structure.door?.column ?? 0]!)
        };

        this.user.room.floorplan.updatePosition(this.position);

        this.direction = room.model.structure.door?.direction ?? 2;

        this.addEventListeners();

        const userEnteredRoomEvent = new OutgoingEvent<UserEnteredRoomEventData>("UserEnteredRoomEvent", this.getRoomUserData());
        
        this.room.sendRoomEvent(userEnteredRoomEvent);
        
        this.user.send([
            new OutgoingEvent<LoadRoomEventData>("LoadRoomEvent", {
                id: this.room.model.id,
                
                information: this.room.getInformationData(),
                
                structure: this.room.model.structure,
                
                users: this.room.users.map((user) => user.getRoomUserData()),
                furnitures: this.room.furnitures.map((furniture) => furniture.getFurnitureData()),
                bots: this.room.bots.map((bot) => bot.getBotData()),

                hasRights: this.hasRights()
            }),
            userEnteredRoomEvent
        ]);

        this.path = new RoomActorPath(this);
    }
    
    private getRoomUserData(): RoomUserData {
        return {
            id: this.user.model.id,
            name: this.user.model.name,
            figureConfiguration: this.user.model.figureConfiguration,

            position: this.position,
            direction: this.direction,
            
            hasRights: this.hasRights(),
            actions: this.actions,
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

            this.room.outgoingEvents.push(
                new OutgoingEvent<UserIdlingEventData>("UserIdlingEvent", {
                    userId: this.user.model.id,
                    idling: true
                })
            );
        }

        this.path.handleActionsInterval();
    }

    private readonly disconnectListener = this.disconnect.bind(this);
    public disconnect() {
        this.removeEventListeners();
        
        this.room.users.splice(this.room.users.indexOf(this), 1);

        this.room.sendRoomEvent(new OutgoingEvent<UserLeftRoomEventData>("UserLeftRoomEvent", {
            userId: this.user.model.id
        }));

        this.user.room?.floorplan.updatePosition(this.position);

        delete this.user.room;

        this.user.send(new OutgoingEvent("LeaveRoomEvent", null));

        if(!this.room.users.length) {
            game.roomManager.unloadRoom(this.room);
        }
    }

    public hasAction(actionId: string): boolean {
        return this.actions.includes(actionId);
    }

    public addAction(action: string, removeAfterMs?: number) {
        if(this.actions.includes(action)) {
            return;
        }

        this.actions.push(action);

        this.room.outgoingEvents.push(
            new OutgoingEvent<ActorActionEventData>("ActorActionEvent", {
                type: "user",
                userId: this.user.model.id,

                actionsAdded: [action],
            })
        );

        // TODO: move this to the client?
        if(removeAfterMs !== undefined) {
            setTimeout(() => {
                this.removeAction(action);
            }, removeAfterMs);
        }
        else if(["Wave", "GestureSmile", "GestureSad", "GestureAngry", "GestureSurprised", "Laugh"].includes(action)) {
            setTimeout(() => {
                this.removeAction(action);
            }, 2000);
        }
    }

    public removeAction(action: string) {
        const actionId = action.split('.')[0]!;

        const existingActionIndex = this.actions.findIndex((action) => action.split('.')[0] === actionId);

        if(existingActionIndex === -1) {
            return;
        }

        this.actions.splice(existingActionIndex, 1);

        this.room.outgoingEvents.push(
            new OutgoingEvent<ActorActionEventData>("ActorActionEvent", {
                type: "user",
                userId: this.user.model.id,
                
                actionsRemoved: [actionId],
            })
        );
    }

    public sendWalkEvent(previousPosition: RoomPosition): void {
        this.room.outgoingEvents.push(new OutgoingEvent<ActorWalkToEventData>("ActorWalkToEvent", {
            type: "user",
            userId: this.user.model.id,

            from: previousPosition,
            to: this.position
        }));
    }

    public sendPositionEvent(usePath: boolean) {
        this.room.outgoingEvents.push(
            new OutgoingEvent<ActorPositionEventData>("ActorPositionEvent", {
                type: "user",
                userId: this.user.model.id,

                position: this.position,
                direction: this.direction,
                usePath: usePath === true
            })
        );
    }

    public getOffsetPosition(direction: number, offset: number) {
        const position = {...this.position};

        switch(direction) {
            case 2:
                position.column += offset;

                break;
        }

        return position;
    }

    public hasRights() {
        if(this.room.model.owner.id === this.user.model.id) {
            return true;
        }

        if(this.room.model.rights.some((rights) => rights.user.id === this.user.model.id)) {
            return true;
        }

        return false;
    }

    public sendRoomMessage(message: string) {
        this.room.sendRoomEvent(new OutgoingEvent<RoomChatEventData>("RoomChatEvent", {
            type: "user",
            userId: this.user.model.id,
            message,
            roomChatStyleId: this.user.model.roomChatStyleId
        }));

        this.lastActivity = performance.now();
    }

    public async handleWalkEvent(previousPosition: RoomPosition, newPosition: RoomPosition) {
        const previousFurniture = this.room.getUpmostFurnitureAtPosition(previousPosition);

        if(previousFurniture) {
            await this.handleWalksOffFurniture?.(previousFurniture);
        }

        const currentFurniture = this.room.getUpmostFurnitureAtPosition(newPosition);

        if(currentFurniture) {
            await this.handleWalksOnFurniture?.(currentFurniture);
        }
    }

    public async handleWalksOnFurniture(roomFurniture: RoomFurniture): Promise<void> {
        return this.room.handleUserWalksOnFurniture(this, roomFurniture);
    }

    public async handleWalksOffFurniture(roomFurniture: RoomFurniture): Promise<void> {
        return this.room.handleUserWalksOffFurniture(this, roomFurniture);
    }
}

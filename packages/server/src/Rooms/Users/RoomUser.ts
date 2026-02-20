import { RoomPosition } from "@shared/Interfaces/Room/RoomPosition.js";
import User from "../../Users/User.js";
import Room from "../Room.js";
import OutgoingEvent from "../../Events/Interfaces/OutgoingEvent.js";
import { UserLeftRoomEventData } from "@shared/Communications/Responses/Rooms/Users/UserLeftRoomEventData.js";
import { UserEnteredRoomEventData } from "@shared/Communications/Responses/Rooms/Users/UserEnteredRoomEventData.js";
import { RoomUserData } from "@shared/Interfaces/Room/RoomUserData.js";
import { UserWalkToEventData } from "@shared/Communications/Responses/Rooms/Users/UserWalkToEventData.js";
import { LoadRoomEventData } from "@shared/Communications/Responses/Rooms/LoadRoomEventData.js";
import { UserActionEventData } from "@shared/Communications/Responses/Rooms/Users/UserActionEventData.js";
import { AStarFinder } from "astar-typescript";
import { UserPositionEventData } from "@shared/Communications/Responses/Rooms/Users/UserPositionEventData.js";
import { UserChatEventData } from "@shared/Communications/Responses/Rooms/Users/UserChatEventData.js";
import RoomFloorplanHelper from "../RoomFloorplanHelper.js";

export default class RoomUser {
    public preoccupiedByActionHandler: boolean = false;
    
    public position: RoomPosition;
    public direction: number;
    public actions: string[] = [];

    public path?: Omit<RoomPosition, "depth">[] | undefined;
    public walkThroughFurniture?: boolean | undefined;
    public pathOnFinish: (() => void) | undefined;
    public pathOnCancel: (() => void) | undefined;

    constructor(public readonly room: Room, public readonly user: User, initialPosition?: RoomPosition) {
        this.user.room = room;

        this.position = initialPosition ?? {
            row: room.model.structure.door?.row ?? 0,
            column: room.model.structure.door?.column ?? 0,
            depth: RoomFloorplanHelper.parseDepth(room.model.structure.grid[room.model.structure.door?.row ?? 0]?.[room.model.structure.door?.column ?? 0]!)
        };

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

                hasRights: this.hasRights()
            }),
            userEnteredRoomEvent
        ]);
    }
    
    private getRoomUserData(): RoomUserData {
        return {
            id: this.user.model.id,
            name: this.user.model.name,
            figureConfiguration: this.user.model.figureConfiguration,

            position: this.position,
            direction: this.direction,
            
            hasRights: this.hasRights(),
            actions: this.actions
        };
    }

    private addEventListeners() {
        this.user.addListener("close", this.disconnectListener);
    }

    private removeEventListeners() {
        this.user.removeListener("close", this.disconnectListener);
    }

    public handleActionsInterval() {
        const nextPosition = this.path?.[0];

        if(!nextPosition || this.path === undefined) {
            this.finishPath();

            return;
        }

        const user = this.room.getRoomUserAtPosition(nextPosition);

        if(user && user.user.model.id !== this.user.model.id) {
            console.log("User path cancelled, user is obstructing");

            this.path = undefined;
            this.pathOnCancel?.();

            return;
        }

        const furniture = this.room.getUpmostFurnitureAtPosition(nextPosition);

        if(furniture) {
            if(!this.walkThroughFurniture && !furniture.isWalkable()) {
                console.log("User path cancelled");

                this.path = undefined;
                this.pathOnCancel?.();

                return;
            }
        }

        const depth = this.room.getUpmostDepthAtPosition(nextPosition, furniture);

        const position = {
            row: nextPosition.row,
            column: nextPosition.column,
            depth
        };

        this.removeAction("Sit");

        this.room.outgoingEvents.push(new OutgoingEvent<UserWalkToEventData>("UserWalkToEvent", {
            userId: this.user.model.id,
            from: this.position,
            to: position
        }));

        this.position = position;
        this.path!.splice(0, 1);
    }

    private readonly disconnectListener = this.disconnect.bind(this);
    public disconnect() {
        this.removeEventListeners();
        
        this.room.users.splice(this.room.users.indexOf(this), 1);

        this.room.sendRoomEvent(new OutgoingEvent<UserLeftRoomEventData>("UserLeftRoomEvent", {
            userId: this.user.model.id
        }));

        delete this.user.room;

        this.user.send(new OutgoingEvent("LeaveRoomEvent", null));
    }

    public addAction(action: string, removeAfterMs?: number) {
        if(this.actions.includes(action)) {
            return;
        }

        this.actions.push(action);

        this.room.outgoingEvents.push(
            new OutgoingEvent<UserActionEventData>("UserActionEvent", {
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
            new OutgoingEvent<UserActionEventData>("UserActionEvent", {
                userId: this.user.model.id,
                actionsRemoved: [actionId],
            })
        );
    }

    public walkTo(position: Omit<RoomPosition, "depth">, walkThroughFurniture: boolean = false, onFinish: ((() => void) | undefined) = undefined, onCancel: ((() => void) | undefined) = undefined) {
        const rows = this.room.model.structure.grid.map((row, rowIndex) => {
            return row.split('').map((column, columnIndex) => {
                if(column === 'X') {
                    return 1;
                }

                if(!walkThroughFurniture) {
                    const furniture = this.user.room!.getUpmostFurnitureAtPosition({ row: rowIndex, column: columnIndex });

                    if(furniture) {
                        if(furniture.model.position.row === this.position.row && furniture.model.position.column === this.position.column) {
                            return 0;
                        }

                        if(!furniture.isWalkable()) {
                            return 1;
                        }
                    }
                }

                const user = this.room.getRoomUserAtPosition({ row: rowIndex, column: columnIndex });

                if(user) {
                    if(rowIndex === this.position.row && columnIndex === this.position.column) {
                        return 0;
                    }

                    if(user.user.model.id === this.user.model.id) {
                        return 0;
                    }
                    
                    if(rowIndex === position.row && columnIndex === position.column) {
                        return 0;
                    }
                    
                    return 1;
                }

                return 0;
            });
        });

        const columns = rows[0]!.map((_, colIndex) => rows.map(row => row[colIndex]!));

        const astarFinder = new AStarFinder({
            grid: {
                matrix: columns
            }
        });

        const result = astarFinder.findPath({
            x: this.position.row,
            y: this.position.column,
        }, {
            x: position.row,
            y: position.column,
        });

        const path = result.map((position) => {
            return {
                row: position[0]!,
                column: position[1]!
            }
        });

        path.splice(0, 1);

        this.path = path;
        this.walkThroughFurniture = walkThroughFurniture;
        this.pathOnFinish = onFinish;
        this.pathOnCancel = onCancel;

        console.log("Result: " + JSON.stringify(path));

        this.room.requestActionsFrame();
    }

    private finishPath() {
        const furniture = this.room.getUpmostFurnitureAtPosition(this.position);

        if(furniture && furniture.model.furniture.flags.sitable) {
            const newPosition = {
                row: this.position.row,
                column: this.position.column,
                depth: furniture.model.position.depth + furniture.model.furniture.dimensions.depth - 0.5
            };

            this.setPosition(newPosition, furniture.model.direction);
            this.addAction("Sit");
        }

        console.log("User path finished");

        this.path = undefined;
        this.pathOnFinish?.();
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

    public setPosition(position: RoomPosition, direction?: number) {
        this.position = position;

        if(direction !== undefined) {
            this.direction = direction;
        }

        this.path = undefined;
        this.pathOnCancel?.();
        
        this.room.outgoingEvents.push(
            new OutgoingEvent<UserPositionEventData>("UserPositionEvent", {
                userId: this.user.model.id,
                position,
                direction
            })
        );
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
        this.room.sendRoomEvent(new OutgoingEvent<UserChatEventData>("UserChatEvent", {
            userId: this.user.model.id,
            message,
            roomChatStyleId: this.user.model.roomChatStyleId
        }));

        this.addAction("Talk", Math.max(800, message.length * 60));
    }
}

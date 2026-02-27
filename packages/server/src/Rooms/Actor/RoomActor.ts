import { RoomPosition } from "@shared/Interfaces/Room/RoomPosition";
import Room from "../Room";
import RoomFurniture from "../Furniture/RoomFurniture";
import RoomActorPath from "./Path/RoomActorPath";

export default interface RoomActor {
    room: Room;

    position: RoomPosition;
    direction: number;

    lastActivity: number;

    path: RoomActorPath;

    sendPositionEvent(usePath: boolean): void;
    sendWalkEvent(previousPosition: RoomPosition): void;
    
    hasAction(actionId: string): boolean;
    addAction(actionId: string): void;
    removeAction(actionId: string): void;

    handleWalkEvent?(previousPosition: RoomPosition, newPosition: RoomPosition): Promise<void>;
    handleWalksOnFurniture?(roomFurniture: RoomFurniture): Promise<void>;
}


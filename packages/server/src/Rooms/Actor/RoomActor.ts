import Room from "../Room.js";
import RoomFurniture from "../Furniture/RoomFurniture.js";
import RoomActorPath from "./Path/RoomActorPath.js";
import { RoomPositionData, RoomPositionOffsetData } from "@pixel63/events";

export default interface RoomActor {
    room: Room;

    position: RoomPositionData;
    direction: number;

    lastActivity: number;

    path: RoomActorPath;

    sendPositionEvent(usePath: boolean): void;
    sendWalkEvent(previousPosition: RoomPositionData): void;
    
    hasAction(actionId: string): boolean;
    addAction(actionId: string): void;
    removeAction(actionId: string): void;

    handleWalkEvent?(previousPosition: RoomPositionOffsetData, newPosition: RoomPositionOffsetData): Promise<void>;
    handleWalksOnFurniture?(roomFurniture: RoomFurniture): Promise<void>;
}


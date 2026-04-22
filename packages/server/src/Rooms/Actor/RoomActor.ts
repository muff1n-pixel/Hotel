import Room from "../Room";
import RoomFurniture from "../Furniture/RoomFurniture";
import RoomActorPath from "./Path/RoomActorPath";
import { RoomActorActionData, RoomPositionData, RoomPositionOffsetData } from "@pixel63/events";

export default interface RoomActor {
    room: Room;

    position: RoomPositionData;
    direction: number;

    lastActivity: number;

    path: RoomActorPath;

    sendPositionEvent(usePath: boolean, roomActorActionsData: RoomActorActionData | null): void;
    sendDirectionEvent(): void;
    sendWalkEvent(previousPosition: RoomPositionData, jump?: boolean): void;

    hasAction(actionId: string): boolean;
    addAction(actionId: string, removeAfterMs?: number, sendProtobuff?: boolean): RoomActorActionData | null;
    removeAction(actionId: string): void;

    handleWalkEvent?(previousPosition: RoomPositionOffsetData, newPosition: RoomPositionOffsetData): Promise<void>;
    handleBeforeWalkEvent?(previousPosition: RoomPositionOffsetData, newPosition: RoomPositionOffsetData): Promise<void>;

    handleWalkToEvent?(position: RoomPositionOffsetData): Promise<void>;
    handleWalksOnFurniture?(roomFurniture: RoomFurniture, previousRoomFurniture: RoomFurniture[]): Promise<void>;
}


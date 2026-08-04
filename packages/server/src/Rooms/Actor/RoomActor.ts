import Room from "../Room";
import RoomFurniture from "../Furniture/RoomFurniture";
import RoomActorPath from "./Path/RoomActorPath";
import { RoomActorActionData, RoomActorIdentifierData, RoomPositionData, RoomPositionOffsetData } from "@pixel63/events";
import RoomActorPose from "./Poses/RoomActorPose";

export default interface RoomActor {
    room: Room;

    position: RoomPositionData;
    direction: number;

    lastActivity: number;

    path: RoomActorPath;
    pose: RoomActorPose;

    sendPositionEvent(usePath: boolean, roomActorActionsData: RoomActorActionData | null): void;
    sendDirectionEvent(): void;
    sendWalkEvent(previousPosition: RoomPositionData, jump?: boolean): void;

    handleWalkEvent?(previousPosition: RoomPositionOffsetData, newPosition: RoomPositionOffsetData): Promise<void>;
    handleBeforeWalkEvent?(previousPosition: RoomPositionOffsetData, newPosition: RoomPositionOffsetData): Promise<void>;

    handleWalkToEvent?(position: RoomPositionOffsetData): Promise<void>;
    handleWalksOnFurniture?(roomFurniture: RoomFurniture, previousRoomFurniture: RoomFurniture[]): Promise<void>;

    getActorIdentifier(): RoomActorIdentifierData;
}


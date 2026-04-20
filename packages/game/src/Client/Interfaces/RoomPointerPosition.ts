import RoomSprite from "@Client/Room/Items/RoomSprite";
import { RoomPositionWithDirectionData } from "@pixel63/events";
import { RoomWorkerItemReference } from "src/Workers/Room/Interfaces/RoomWorkerFurnitureReference";

export type RoomPointerPosition = {
    reference: RoomWorkerItemReference;

    sprite?: RoomSprite;
    position?: RoomPositionWithDirectionData;
    direction?: number;
}


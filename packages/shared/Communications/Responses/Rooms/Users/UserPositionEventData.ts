import { RoomPosition } from "../../../../Interfaces/Room/RoomPosition.js";

export type UserPositionEventData = {
    userId: string;
    position: RoomPosition;
    direction?: number | undefined;
    usePath?: boolean;
};

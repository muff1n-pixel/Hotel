import { RoomPosition } from "../../../Interfaces/Room/RoomPosition.js";

export type PurchaseShopFurnitureEventData = {
    shopFurnitureId: string;
    position?: RoomPosition;
    direction?: number;
    data?: unknown;
};

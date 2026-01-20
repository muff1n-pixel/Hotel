import { FurnitureData } from "../../../Interfaces/Room/RoomFurnitureData.js";

export type ShopPageFurnitureData = {
    id: string;
    credits?: number | undefined;
    duckets?: number | undefined;
    diamonds?: number | undefined;
    furniture: FurnitureData;
};

export type ShopPageFurnitureEventData = {
    pageId: string;
    furniture: ShopPageFurnitureData[];
};

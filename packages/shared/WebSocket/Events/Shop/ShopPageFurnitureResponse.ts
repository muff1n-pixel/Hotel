import { FurnitureData } from "../../../Interfaces/Room/RoomFurnitureData.js";

export type ShopPageFurnitureData = {
    id: string;
    furniture: FurnitureData;
};

export type ShopPageFurnitureResponse = {
    pageId: string;
    furniture: ShopPageFurnitureData[];
};

export type ShopPageFurnitureData = {
    id: string;
    type: string;
};

export type ShopPageFurnitureResponse = {
    pageId: string;
    furniture: ShopPageFurnitureData[];
};

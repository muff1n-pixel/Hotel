import { ShopPageCategory } from "../../Requests/Shop/GetShopPagesEventData.js";

export type ShopPageFeatureData = {
    id: string;
    title: string;
    image: string;
    type: "horizontal" | "vertical";
    
    page: {
        id: string;
        category: ShopPageCategory;
    };
};

export type ShopPageData = {
    id: string;
    category: ShopPageCategory;
    
    title: string;
    description?: string;

    type: string;
    
    icon?: string | undefined;
    header?: string | undefined;
    teaser?: string | undefined;

    index: number;

    features: ShopPageFeatureData[] | undefined;

    children?: Omit<ShopPageData, "children">[];
};

export type ShopPagesEventData = {
    category: "frontpage" | "furniture" | "clothing" | "pets";
    pages: ShopPageData[];
};

export type ShopPageFeatureData = {
    id: string;
    title: string;
    image: string;
    type: "horizontal" | "vertical";
    
    page: {
        id: string;
        category: string;
    };
};

export type ShopPageData = {
    id: string;
    
    title: string;
    description?: string;

    type: "default" | "features" | "none";
    
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

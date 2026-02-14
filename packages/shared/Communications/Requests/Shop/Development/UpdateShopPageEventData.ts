export type UpdateShopPageEventData = {
    id: string | null;
    parentId: string | null;

    category: string;

    title: string;
    description: string;

    icon: string;
    header: string;
    teaser: string;

    index: number;
};

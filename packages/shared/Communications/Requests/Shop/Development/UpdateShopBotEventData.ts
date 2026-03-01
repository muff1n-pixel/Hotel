import { FigureConfigurationData } from "@pixel63/events";

export type UpdateShopBotEventData = {
    id: string | null;

    pageId: string;

    type: string;
    
    name: string;
    motto: string | null;
    
    figureConfiguration: FigureConfigurationData;

    credits: number;
    duckets: number;
    diamonds: number;
};

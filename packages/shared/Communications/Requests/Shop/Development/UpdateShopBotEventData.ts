import { BotTypeData } from "../../../../Interfaces/Bots/BotTypeData.js";
import { FigureConfiguration } from "../../../../Interfaces/Figure/FigureConfiguration.js";

export type UpdateShopBotEventData = {
    id: string | null;

    pageId: string;

    type: BotTypeData;
    
    name: string;
    motto: string | null;
    
    figureConfiguration: FigureConfiguration;

    credits: number;
    duckets: number;
    diamonds: number;
};

import { BotTypeData } from "../../../Interfaces/Bots/BotTypeData.js";
import { FigureConfiguration } from "../../../Interfaces/Figure/FigureConfiguration.js";

export type ShopPageBotData = {
    id: string;

    credits?: number | undefined;
    duckets?: number | undefined;
    diamonds?: number | undefined;

    figureConfiguration: FigureConfiguration;

    name: string;
    motto: string | null;

    type: BotTypeData;
};

export type ShopPageBotsEventData = {
    pageId: string;
    bots: ShopPageBotData[];
};

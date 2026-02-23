import { BotTypeData } from "../Bots/BotTypeData.js";
import { FigureConfiguration } from "../Figure/FigureConfiguration.js";

export type UserBotData = {
    id: string;
    userId: string;

    type: BotTypeData;

    name: string;
    motto: string | null;

    figureConfiguration: FigureConfiguration;
    
    position: {
        row: number;
        column: number;
        depth: number;
    };
    
    direction: number;
};

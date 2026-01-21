import { FigureConfiguration } from "../../../Interfaces/Figure/FigureConfiguration.js";

export type UserEventData = {
    id: string;
    name: string;
    credits: number;
    duckets: number;
    diamonds: number;
    figureConfiguration: FigureConfiguration;
};

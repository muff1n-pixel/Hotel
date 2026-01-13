import { FigureConfiguration } from "../../../Interfaces/figure/FigureConfiguration.js"

export type UserDataUpdated = {
    id: string;
    name: string;
    figureConfiguration: FigureConfiguration;
};

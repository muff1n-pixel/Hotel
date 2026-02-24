import { FigureConfiguration } from "../Figure/FigureConfiguration.js";

export type RoomUserData = {
    id: string;
    name: string;
    figureConfiguration: FigureConfiguration;
    
    position: {
        row: number;
        column: number;
        depth: number;
    };

    typing: boolean;
    idling: boolean;
    
    direction: number;
    hasRights: boolean;
    actions: string[];
};

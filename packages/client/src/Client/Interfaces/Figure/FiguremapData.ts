import { FigurePartKeyAbbreviation } from "@shared/interfaces/figure/FigureConfiguration";

export type FiguremapData = {
    id: string;

    parts: {
        id: string;
        type: FigurePartKeyAbbreviation;
    }[];
}[];

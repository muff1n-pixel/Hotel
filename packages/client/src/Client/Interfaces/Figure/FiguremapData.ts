import { FigurePartKeyAbbreviation } from "@Shared/interfaces/figure/FigureConfiguration";

export type FiguremapData = {
    id: string;

    parts: {
        id: string;
        type: FigurePartKeyAbbreviation;
    }[];
}[];

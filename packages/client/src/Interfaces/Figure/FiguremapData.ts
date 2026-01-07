import { FigurePartKeyAbbreviation } from "@/Figure/FigureRenderer";

export type FiguremapData = {
    id: string;

    parts: {
        id: string;
        type: FigurePartKeyAbbreviation;
    }[];
}[];

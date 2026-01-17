import { FigurePartKeyAbbreviation } from "@Shared/interfaces/figure/FigureConfiguration";

export type FiguredataData = {
    palettes: {
        id: number;
        colors: {
            id: number;
            index: number;
            club: boolean;
            selectable: boolean;
            preselectable: boolean;
            color?: string;
        }[];
    }[];

    settypes: {
        type: FigurePartKeyAbbreviation;
        paletteId: number;
        mandatoryGender: {
            male: boolean[];
            female: boolean[];
        };
        sets: {
            id: string;
            gender: 'M' | 'F' | 'U';
            club: boolean;
            colorable: boolean;
            selectable: boolean;
            preselectable: boolean;
            paletteId: number;
            parts: {
                id: string;
                type: FigurePartKeyAbbreviation;
                colorable: boolean;
                index: number;
                colorIndex: number;
            }[];
        }[];
    }[];
};

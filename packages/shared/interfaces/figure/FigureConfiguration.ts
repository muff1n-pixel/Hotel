export type FigurePartKeyAbbreviation = "hr" | "lg" | "ch" | "hd" | "sh" | "he" | "wa" | "ha" | "ca" | "ea" | "fa" | "cp" | "cc";
export type FigurePartKey = "hair" | "leg" | "shirt" | "body" | "shoe" | "head" | "waist" | "hat" | "chest" | "eye" | "face";

export type FigureConfiguration = {
    type: FigurePartKeyAbbreviation;
    setId: string;
    colorIndex?: number | undefined;
}[];

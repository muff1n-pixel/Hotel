export type FigureItemKeyAbbreviation = "hr" | "lg" | "ch" | "hd" | "sh" | "he" | "wa" | "ha" | "ca" | "ea";
export type FigureItemKey = "hair" | "leg" | "shirt" | "body" | "shoe" | "head" | "waist" | "hat" | "chest" | "eye";

export type FigureConfiguration = Record<FigureItemKey, {
    setId: number;
    colorIndex?: number;
}>;

export default class FigureRenderer {
    public static figureItemAbbreviations: Record<FigureItemKey, FigureItemKeyAbbreviation> = {
        hair: "hr",
        leg: "lg",
        shirt: "ch",
        body: "hd",
        shoe: "sh",
        head: "he",
        waist: "wa",
        hat: "ha",
        chest: "ca",
        eye: "ea"
    };

    constructor(private readonly configuration: FigureConfiguration) {

    }

    public async render() {
        
    }
}

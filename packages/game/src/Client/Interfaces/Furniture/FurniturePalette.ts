export type FurniturePalette = {
    id: number;
    source: string;

    color1: string;
    color2?: string;

    master: boolean;

    tags: string[];

    breed?: number;
    colorTag?: number;
};

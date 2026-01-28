export type FigureAnimationData = {
    sprites: {
        id: string;
        member: string;
        ink?: number;
        useDirections: boolean;
        directions?: {
            id: number;
            destinationZ: number;
        }[];
    }[];

    add: {
        id: string;
        align: string;
        base?: string;
    }[];

    frames: {
        bodyParts: {
            id: string;
            action: string;
            frame: number;

            destinationY?: number;
        }[];

        effects: {
            id: string;
            action: string;
            frame: number;

            destinationY?: number;
        }[];
    }[];
};

export type FigureAnimationFrameEffectData = {
    id: string;
    action: string;
    frame: number;

    destinationY?: number;
};

export type FigureAnimationData = {
    sprites: {
        id: string;
        member: string;
        ink?: number;
        useDirections: boolean;
        destinationY?: number;
        directions?: {
            id: number;
            destinationX: number | undefined;
            destinationY: number | undefined;
            destinationZ: number;
        }[];
    }[];

    add: {
        id: string;
        align: string;
        base?: string;
    }[];

    direction: undefined | {
        offset: number;
    };
    
    shadow: undefined | {
        id: string;
    };

    frames: {
        bodyParts: {
            id: string;
            action: string;
            frame: number;

            destinationX?: number;
            destinationY?: number;
            directionOffset?: number;
        }[];

        effects: FigureAnimationFrameEffectData[];
    }[];
};

export type FigureAnimationFrameEffectData = {
    id: string;
    action: string;
    frame: number;

    destinationX?: number;
    destinationY?: number;
};

export type FigureAnimationData = {
    avatar?: {
        ink: number;
        foreground: string;
        background: string;
    } | undefined;

    sprites: {
        id: string;
        frame?: number;
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

    remove: {
        id: string;
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

            items: {
                id: string;
                align: string;
                base?: string;
            }[];
        }[];

        effects: FigureAnimationFrameEffectData[];
    }[];

    overrides: {
        name: string;
        type: string;

        frames: FigureAnimationData["frames"];
    }[];
};

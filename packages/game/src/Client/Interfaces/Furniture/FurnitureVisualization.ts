export type FurnitureAnimationLayerFrameOffset = {
    direction: number;

    left?: number;
    top?: number;
};

export type FurnitureAnimationLayerFrame = {
    id: number;

    left?: number;
    top?: number;

    offsets?: FurnitureAnimationLayerFrameOffset[];
};

export type FurnitureVisualization = {
    type: string;

    defaultDirection?: number;
    placement?: "floor" | "wall";

    visualizations: {
        size: 1 | 32 | 64;
        layerCount: number;
        angle: number;

        layers: {
            id: number;
            zIndex: number;
            ink?: string;
            tag?: string;
            ignoreMouse?: boolean;
            alpha?: number;
        }[];

        directions: {
            id: number;
            layers: {
                id: number;
                x?: number;
                y?: number;
                zIndex?: number;
            }[];
        }[];

        colors: {
            id: number;

            layers: {
                id: number;
                color: string;
            }[];
        }[];

        animations: {
            id: number;

            layers: {
                id: number;
                loopCount?: number;
                frameRepeat?: number;
                random: boolean;

                frameSequence: FurnitureAnimationLayerFrame[];
            }[];
        }[];

        postures: {
            id: string;

            animationId: number;
        }[];

        gestures: {
            id: string;

            animationId: number;
        }[];
    }[];
};

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
            ignoreMouse?: boolean;
            alpha?: number;
        }[];

        directions: {
            id: number;
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

                frameSequence: {
                    id: number;
                }[];
            }[];
        }[];
    }[];
};

export type FurnitureVisualization = {
    type: string;

    visualizations: {
        size: 1 | 32 | 64;
        layerCount: number;
        angle: number;

        layers: {
            id: number;
            zIndex: number;
        }[];

        directions: {
            id: number;
        }[];
    }[];
};

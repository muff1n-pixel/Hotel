export type RoomVisualization = {
    wallData: {
        walls: {
            id: string;

            visualizations: {
                size: number;

                color: string;
                materialId: string;
            }[];
        }[];

        materials: {
            id: string;

            width: number;
            textureId: string;
        }[];

        textures: {
            id: string;

            assetName: string;
        }[];
    };

    floorData: {
        floors: {
            id: string;

            visualizations: {
                size: number;

                color: string;
                materialId: string;
            }[];
        }[];

        materials: {
            id: string;

            width: number;
            textureId: string;
        }[];

        textures: {
            id: string;

            assetName: string;
        }[];
    };
};

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

    landscapeData: {
        landscapes: {
            id: string;
            visualizations: {
                size: number;

                visualizationLayers: {
                    materialId: string;
                    align: string;
                    color: string;
                }[];

                animationLayers: {
                    id: number;
                    assetId: string;

                    speedX?: number;
                    speedY?: number;
                    
                    randomX?: number;
                    randomY?: number;
                }[];
            }[];
        }[];

        materials: {
            id: string;
            cellMatrixes: {
                repeatMode: string;
                align: string;
                normalMinX: number;

                cellColumns: {
                    width: number;
                    repeatMode: string;

                    cells: {
                        textureId: string;

                        extraItemData?: {
                            limitMax: number;

                            types: {
                                assetName: string;
                            }[];

                            offsets: {
                                id: number;

                                x: number;
                                y: number;
                            }[];
                        };
                    }[];
                }[];
            }[];
        }[];
    };
};

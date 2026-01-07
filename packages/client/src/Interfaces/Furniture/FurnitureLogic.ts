export type FurnitureLogic = {
    type: string;

    model: {
        dimensions: {
            x: number;
            y: number;
            z: number;
        };

        directions: {
            id: number;
        }[];
    };
};

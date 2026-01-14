export type RoomStructure = {
    grid: string[];

    door?: {
        row: number;
        column: number;
    };

    wall: {
        id: string;
        thickness: number;
    }

    floor: {
        id: string;
        thickness: number;
    }
};

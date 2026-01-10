export type RoomStructure = {
    grid: string[];

    door: {
        row: number;
        column: number;
    };

    wall: {
        thickness: number;
    }

    floor: {
        thickness: number;
    }
};

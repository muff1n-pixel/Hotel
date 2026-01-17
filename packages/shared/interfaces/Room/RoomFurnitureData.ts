export type FurnitureData = {
    type: string;
    color?: number;
    
    name: string;
    description?: string;

    placement: "floor" | "wall";
}

export type RoomFurnitureData = {
    id: string;
    furniture: FurnitureData;
    position: {
        row: number;
        column: number;
        depth: number;
    };
    direction: number;
    animation: number;
};

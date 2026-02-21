import { FurnitureFlagsData } from "../../../Interfaces/Furniture/FurnitureFlags.js";

export type UpdateFurnitureEventData = {
    furnitureId: string;

    name: string;
    description: string;

    category: string;
    interactionType: string;

    flags: FurnitureFlagsData;
    depth: number;
};

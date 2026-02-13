import { RoomFurnitureData } from "../../../Interfaces/Room/RoomFurnitureData.js";
import { RoomStructure } from "../../../Interfaces/Room/RoomStructure.js";
import { RoomUserData } from "../../../Interfaces/Room/RoomUserData.js";

export type RoomInformationData = {
    name: string;
    description: string;
    category: string;

    owner: {
        id: string;
        name: string;
    };

    maxUsers: number;
};

export type LoadRoomEventData = {
    id: string;
    
    information: RoomInformationData;

    structure: RoomStructure;
    users: RoomUserData[];
    furnitures: RoomFurnitureData[];
    
    hasRights: boolean;
};

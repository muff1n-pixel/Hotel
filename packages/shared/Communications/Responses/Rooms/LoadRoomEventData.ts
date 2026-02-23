import { UserBotData } from "../../../Interfaces/Room/RoomBotData.js";
import { RoomFurnitureData } from "../../../Interfaces/Room/RoomFurnitureData.js";
import { RoomStructure } from "../../../Interfaces/Room/RoomStructure.js";
import { RoomType } from "../../../Interfaces/Room/RoomType.js";
import { RoomUserData } from "../../../Interfaces/Room/RoomUserData.js";

export type RoomInformationData = {
    type: RoomType;
    
    name: string;
    description: string;
    category: string;
    thumbnail: string | null;

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
    bots: UserBotData[];
    
    hasRights: boolean;
};

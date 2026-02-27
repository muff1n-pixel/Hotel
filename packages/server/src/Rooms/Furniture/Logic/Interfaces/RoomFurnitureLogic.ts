import { UseRoomFurnitureEventData } from "@shared/Communications/Requests/Rooms/Furniture/UseRoomFurnitureEventData.js";
import RoomUser from "../../../Users/RoomUser.js";
import RoomFurniture from "../../RoomFurniture.js";

export type RoomFurnitureHandleUserChatResult = { blockUserChat?: boolean; } | null;

export default interface RoomFurnitureLogic {
    use?(roomUser: RoomUser, event: UseRoomFurnitureEventData): Promise<void>;

    handleUserEnteredRoom?(roomUser: RoomUser): Promise<void>;
    handleUserChat?(roomUser: RoomUser, message: string): Promise<RoomFurnitureHandleUserChatResult>;
    handleUserWalksOn?(roomUser: RoomUser): Promise<void>;
    handleUserWalksOff?(roomUser: RoomUser): Promise<void>;

    handleActionsInterval?(): Promise<void>;
}

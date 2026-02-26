import { UseRoomFurnitureEventData } from "@shared/Communications/Requests/Rooms/Furniture/UseRoomFurnitureEventData.js";
import RoomUser from "../../../Users/RoomUser.js";

export type RoomFurnitureHandleUserChatResult = { blockUserChat?: boolean; } | null;

export default interface RoomFurnitureLogic {
    use?(roomUser: RoomUser, event: UseRoomFurnitureEventData): Promise<void>;
    walkOn?(roomUser: RoomUser): Promise<void>;

    handleUserChat?(roomUser: RoomUser, message: string): Promise<RoomFurnitureHandleUserChatResult>;
    
    handleActionsInterval?(): Promise<void>;
}

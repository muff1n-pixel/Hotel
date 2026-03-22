import { UseRoomFurnitureData } from "@pixel63/events";
import RoomUser from "../../../Users/RoomUser.js";
import RoomFurniture from "../../RoomFurniture.js";

export type RoomFurnitureHandleUserChatResult = { blockUserChat?: boolean; } | null;

export default interface RoomFurnitureLogic {
    use?(roomUser: RoomUser, event: UseRoomFurnitureData): Promise<void>;

    handleUserEnteredRoom?(roomUser: RoomUser): Promise<void>;
    handleUserLeftRoom?(roomUser: RoomUser): Promise<void>;
    
    handleUserChat?(roomUser: RoomUser, message: string): Promise<RoomFurnitureHandleUserChatResult>;
    handleUserWalksOn?(roomUser: RoomUser, previousRoomFurniture: RoomFurniture | undefined): Promise<void>;
    handleUserWalksOff?(roomUser: RoomUser, newRoomFurniture: RoomFurniture | undefined): Promise<void>;

    handleActionsInterval?(): Promise<void>;
    handleMinuteInterval?(): Promise<void>;
}

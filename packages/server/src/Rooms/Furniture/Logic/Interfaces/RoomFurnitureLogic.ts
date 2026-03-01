import { UseRoomFurnitureData } from "@pixel63/events";
import RoomUser from "../../../Users/RoomUser.js";

export type RoomFurnitureHandleUserChatResult = { blockUserChat?: boolean; } | null;

export default interface RoomFurnitureLogic {
    use?(roomUser: RoomUser, event: UseRoomFurnitureData): Promise<void>;

    handleUserEnteredRoom?(roomUser: RoomUser): Promise<void>;
    handleUserChat?(roomUser: RoomUser, message: string): Promise<RoomFurnitureHandleUserChatResult>;
    handleUserWalksOn?(roomUser: RoomUser): Promise<void>;
    handleUserWalksOff?(roomUser: RoomUser): Promise<void>;

    handleActionsInterval?(): Promise<void>;
}

import { RoomPositionData, UseRoomFurnitureData } from "@pixel63/events";
import RoomUser from "../../../Users/RoomUser.js";
import RoomFurniture from "../../RoomFurniture.js";

export type RoomFurnitureHandleUserChatResult = { blockUserChat?: boolean; } | null;

export default interface RoomFurnitureLogic {
    use?(roomUser: RoomUser, event: UseRoomFurnitureData): Promise<void>;

    isWalkable?(): boolean;

    handleUserEnteredRoom?(roomUser: RoomUser): Promise<void>;
    handleUserLeftRoom?(roomUser: RoomUser): Promise<void>;

    handleDataChanged?(roomUser: RoomUser): void;
    
    handleUserChat?(roomUser: RoomUser, message: string): Promise<RoomFurnitureHandleUserChatResult>;
    handleUserWalksTo?(roomUser: RoomUser): Promise<void>;

    handleBeforeUserWalksOn?(roomUser: RoomUser, previousRoomFurniture: RoomFurniture[]): Promise<void>;
    handleUserWalksOn?(roomUser: RoomUser, previousRoomFurniture: RoomFurniture[]): Promise<void>;
    
    handleBeforeUserWalksOff?(roomUser: RoomUser, newRoomFurniture: RoomFurniture[]): Promise<void>;
    handleUserWalksOff?(roomUser: RoomUser, newRoomFurniture: RoomFurniture[]): Promise<void>;
    
    handleUserDoubleClickOnTile?(roomUser: RoomUser, tile: RoomPositionData): Promise<void>;

    handleActionsInterval?(): Promise<void>;
    handleMinuteInterval?(): Promise<void>;
}

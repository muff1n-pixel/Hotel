import { UseRoomFurnitureEventData } from "@shared/Communications/Requests/Rooms/Furniture/UseRoomFurnitureEventData.js";
import RoomUser from "../../../Users/RoomUser.js";

export default interface RoomFurnitureLogic {
    use(roomUser: RoomUser, event: UseRoomFurnitureEventData): Promise<void>;
    walkOn?(roomUser: RoomUser): Promise<void>;
    
    handleActionsInterval(): Promise<void>;
}

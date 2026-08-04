import { UseRoomFurnitureData } from "@pixel63/events";
import RoomUser from "../../../../Users/RoomUser.js";
import RoomFurniture from "../../../RoomFurniture.js";
import RoomFurnitureLogic from "../../Interfaces/RoomFurnitureLogic.js";
import { RoomFootballGameTeam } from "../../../../Games/Football/Interfaces/RoomFootballGameTeam.js";

export default class RoomFurnitureFootballGoalLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture, public readonly team: RoomFootballGameTeam) {
    }

    async use(roomUser: RoomUser, payload: UseRoomFurnitureData): Promise<void> {

    }

    async handleActionsInterval(): Promise<void> {
        
    }
}

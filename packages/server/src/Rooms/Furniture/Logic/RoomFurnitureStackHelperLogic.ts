import { RoomPositionData, UseRoomFurnitureData } from "@pixel63/events";
import RoomUser from "../../Users/RoomUser.js";
import RoomFurniture from "../RoomFurniture.js";
import RoomFurnitureLogic from "./Interfaces/RoomFurnitureLogic.js";

export default class RoomFurnitureStackHelperLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {

    }

    handleDataChanged(roomUser: RoomUser): void {
        if(this.roomFurniture.model.data?.stackHelper?.height === undefined) {
            return;
        }

        this.roomFurniture.model.data.stackHelper.height = Math.max(this.roomFurniture.model.data.stackHelper.height, 0);
        this.roomFurniture.model.data.stackHelper.height = Math.min(this.roomFurniture.model.data.stackHelper.height, 72);

        this.roomFurniture.model.position = RoomPositionData.create({
            row: this.roomFurniture.model.position.row,
            column: this.roomFurniture.model.position.column,
            depth: this.roomFurniture.model.data.stackHelper.height
        });
    }

    async handleActionsInterval(): Promise<void> {
        
    }
}

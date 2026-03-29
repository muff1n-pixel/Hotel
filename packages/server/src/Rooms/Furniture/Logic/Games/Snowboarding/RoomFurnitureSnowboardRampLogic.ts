import { RoomPositionOffsetData, UseRoomFurnitureData } from "@pixel63/events";
import RoomFurnitureLogic from "../../Interfaces/RoomFurnitureLogic";
import RoomFurniture from "../../../RoomFurniture";
import RoomUser from "../../../../Users/RoomUser";
import Directions from "../../../../../Helpers/Directions";

export default class RoomFurnitureSnowboardRampLogic implements RoomFurnitureLogic {

    constructor(public readonly roomFurniture: RoomFurniture) {

    }

    async handleBeforeUserWalksOff(roomUser: RoomUser, newRoomFurniture: RoomFurniture[]): Promise<void> {
        if(!this.isRoomUserSkating(roomUser)) {
            return;
        }

        if(roomUser.hasAction("SnowboardOllie") || roomUser.hasAction("Snowboard360")) {
            return;
        }

        if(roomUser.direction !== this.roomFurniture.model.direction) {
            return;
        }

        const offsetPosition = RoomPositionOffsetData.fromJSON(roomUser.position);

        const upmostFurniture = this.roomFurniture.room.getUpmostFurnitureAtPosition(offsetPosition);
        const upmostDepth = this.roomFurniture.room.getUpmostDepthAtPosition(offsetPosition, upmostFurniture);

        const rampDepth = this.roomFurniture.model.position.depth + this.roomFurniture.model.furniture.dimensions.depth;

        if(upmostDepth >= rampDepth) {
            return;
        }

        if(rampDepth - upmostDepth >= 2) {
            roomUser.addAction("Snowboard360", 2000);
        }
        else {
            roomUser.addAction("SnowboardOllie", 2000);
        }
    }

    async use(roomUser: RoomUser, payload: UseRoomFurnitureData): Promise<void> {

    }

    async handleActionsInterval(): Promise<void> {
    }

    private isRoomUserSkating(roomUser: RoomUser) {
        return roomUser.hasAction("AvatarEffect.97");
    }
}

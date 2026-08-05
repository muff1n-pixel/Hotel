import { RoomPositionOffsetData, UseRoomFurnitureData } from "@pixel63/events";
import RoomFurnitureLogic from "../../Interfaces/RoomFurnitureLogic";
import RoomFurniture from "../../../RoomFurniture";
import RoomUser from "../../../../Users/RoomUser";
import Directions from "../../../../../../Game/Helpers/Directions";

export default class RoomFurnitureSnowboardRampLogic implements RoomFurnitureLogic {

    constructor(public readonly roomFurniture: RoomFurniture) {

    }

    async handleBeforeUserWalksOff(roomUser: RoomUser, newRoomFurniture: RoomFurniture[]): Promise<void> {
        if(!this.isRoomUserSkating(roomUser)) {
            return;
        }

        if(roomUser.pose.hasEffect("SnowboardOllie") || roomUser.pose.hasEffect("Snowboard360")) {
            return;
        }

        if(roomUser.direction !== this.roomFurniture.model.direction) {
            return;
        }

        const offsetPosition = RoomPositionOffsetData.fromJSON(roomUser.position);

        const upmostFurniture = this.roomFurniture.room.getUpmostFurnitureAtPosition(offsetPosition);
        const upmostDepth = this.roomFurniture.room.getUpmostDepthAtPosition(offsetPosition, upmostFurniture);

        if(upmostDepth === null) {
            return;
        }

        const rampDepth = this.roomFurniture.model.position.depth + this.roomFurniture.model.furniture.dimensions.depth;

        if(upmostDepth >= rampDepth) {
            return;
        }

        if(rampDepth - upmostDepth >= 3) {
            roomUser.pose.setEffect("Snowboard360");
        }
        else {
            roomUser.pose.setEffect("SnowboardOllie");
        }

        roomUser.user.achievements.addAchievementScore("SnowboardJumps", 1).catch(console.error);
    }

    async use(roomUser: RoomUser, payload: UseRoomFurnitureData): Promise<void> {

    }

    async handleActionsInterval(): Promise<void> {
    }

    private isRoomUserSkating(roomUser: RoomUser) {
        return roomUser.pose.hasEffect("AvatarEffect.97");
    }
}

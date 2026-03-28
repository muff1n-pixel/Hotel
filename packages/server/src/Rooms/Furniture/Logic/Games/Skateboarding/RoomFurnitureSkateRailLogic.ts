import { UseRoomFurnitureData } from "@pixel63/events";
import RoomFurnitureLogic from "../../Interfaces/RoomFurnitureLogic";
import RoomFurniture from "../../../RoomFurniture";
import RoomUser from "../../../../Users/RoomUser";
import Directions from "../../../../../Helpers/Directions";

export default class RoomFurnitureSkateRailLogic implements RoomFurnitureLogic {

    constructor(public readonly roomFurniture: RoomFurniture) {

    }

    async handleBeforeUserWalksOn(roomUser: RoomUser, previousRoomFurniture: RoomFurniture[]): Promise<void> {
        if(!this.isRoomUserSkating(roomUser)) {
            return;
        }

        let direction = roomUser.direction - (this.roomFurniture.model.direction ?? 0) - 2;

        const previousSkateRail = previousRoomFurniture.find((furniture) => furniture.logic instanceof RoomFurnitureSkateRailLogic);

        if(previousSkateRail && previousSkateRail.model.direction === this.roomFurniture.model.direction && this.roomFurniture.model.direction === 2) {
            direction += 2;
        }

        roomUser.direction = Directions.normalizeDirection(direction);
    }

    async handleUserWalksOn(roomUser: RoomUser, previousRoomFurniture: RoomFurniture[]): Promise<void> {
        if(!this.isRoomUserSkating(roomUser)) {
            return;
        }

        if(roomUser.path.path && roomUser.path.path.length === 0) {
            let userDirection = roomUser.direction + (this.roomFurniture.model.direction ?? 0) + 2;

            const previousSkateRail = previousRoomFurniture.find((furniture) => furniture.logic instanceof RoomFurnitureSkateRailLogic);

            if(previousSkateRail && previousSkateRail.model.direction === this.roomFurniture.model.direction && this.roomFurniture.model.direction === 2) {
                userDirection -= 2;
            }

            userDirection = Directions.normalizeDirection(userDirection);

            for(const direction of [0, 1, -1]) {
                const offsetPosition = this.roomFurniture.getOffsetPosition(1, Directions.normalizeDirection(userDirection + direction));

                const nextSkateRail = this.roomFurniture.room.getUpmostFurnitureAtPosition(offsetPosition);

                if(nextSkateRail && nextSkateRail.logic instanceof RoomFurnitureSkateRailLogic) {
                    if(nextSkateRail.model.direction !== this.roomFurniture.model.direction) {
                        roomUser.path.walkTo(offsetPosition, undefined, undefined, undefined, true);

                        roomUser.user.achievements.addAchievementScore("SkateboardJumper", 1).catch(console.error);
                    }
                    else {
                        roomUser.path.walkTo(offsetPosition);
                    
                        roomUser.user.achievements.addAchievementScore("SkateboardSlider", 1).catch(console.error);
                    }

                    break;
                }
            }
        }
    }

    async use(roomUser: RoomUser, payload: UseRoomFurnitureData): Promise<void> {

    }

    async handleActionsInterval(): Promise<void> {
    }

    private isRoomUserSkating(roomUser: RoomUser) {
        return roomUser.hasAction("AvatarEffect.71") || roomUser.hasAction("AvatarEffect.72");
    }
}

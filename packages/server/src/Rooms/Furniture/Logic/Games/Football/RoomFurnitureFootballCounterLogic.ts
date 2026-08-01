import { UserFurnitureAnimationTag, UseRoomFurnitureData } from "@pixel63/events";
import RoomUser from "../../../../Users/RoomUser.js";
import RoomFurniture from "../../../RoomFurniture.js";
import RoomFurnitureLogic from "../../Interfaces/RoomFurnitureLogic.js";
import { RoomFootballGameTeam } from "../../../../Games/Football/Interfaces/RoomFootballGameTeam.js";

export default class RoomFurnitureFootballCounterLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture, public readonly team: RoomFootballGameTeam) {
        this.roomFurniture.setAnimation(0);
    }

    public async updateAnimationTags(score: number) {
        const clampedScore = Math.max(0, Math.min(99, score));

        if(!clampedScore) {
            this.roomFurniture.setAnimation(0);

            return;
        }

        this.roomFurniture.setAnimation(clampedScore);
    }

    async use(roomUser: RoomUser, payload: UseRoomFurnitureData): Promise<void> {

    }

    async handleActionsInterval(): Promise<void> {
        
    }
}

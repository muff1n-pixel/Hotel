import { UserFurnitureAnimationTag, UseRoomFurnitureData } from "@pixel63/events";
import RoomUser from "../../../../Users/RoomUser.js";
import RoomFurniture from "../../../RoomFurniture.js";
import RoomFurnitureLogic from "../../Interfaces/RoomFurnitureLogic.js";
import { RoomFreezeGameTeam } from "../../../../Games/Freeze/RoomFreezeGame.js";

export default class RoomFurnitureFreezeCounterLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture, public readonly team: RoomFreezeGameTeam) {
        this.roomFurniture.setAnimation(0).catch(console.error);
    }

    public async updateAnimationTags(score: number) {
        const clampedScore = Math.max(0, Math.min(999, score));

        if(!clampedScore) {
            await this.roomFurniture.setAnimation(0);

            return;
        }

        const hundredsDigits = Math.floor(clampedScore / 100);
        const tensDigits = Math.floor((clampedScore % 100) / 10);
        const onesDigits = clampedScore % 10;

        await this.roomFurniture.setAnimationTags([
            UserFurnitureAnimationTag.create({
                tag: "hundreds_sprite",
                frame: hundredsDigits
            }),
            UserFurnitureAnimationTag.create({
                tag: "tens_sprite",
                frame: tensDigits
            }),
            UserFurnitureAnimationTag.create({
                tag: "ones_sprite",
                frame: onesDigits
            })
        ]);
    }

    async use(roomUser: RoomUser, payload: UseRoomFurnitureData): Promise<void> {

    }

    async handleActionsInterval(): Promise<void> {
        
    }
}

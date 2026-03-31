import { randomUUID } from "crypto";
import { UserClothesModel } from "../../../Database/Models/Users/Clothes/UserClothesModel.js";
import RoomUser from "../../Users/RoomUser.js";
import RoomFurniture from "../RoomFurniture.js";
import RoomFurnitureLogic from "./Interfaces/RoomFurnitureLogic.js";
import { RoomFurnitureData, UseRoomFurnitureData } from "@pixel63/events";

export default class RoomFurnitureClothingLogic implements RoomFurnitureLogic {
    private unboxingStartedAt: number | null = null;

    constructor(private readonly roomFurniture: RoomFurniture) {

    }

    async use(roomUser: RoomUser, payload: UseRoomFurnitureData): Promise<void> {
        if(this.unboxingStartedAt !== null) {
            return;
        }

        if(roomUser.user.model.id !== this.roomFurniture.model.userId) {
            return;
        }

        this.unboxingStartedAt = performance.now();

        await this.roomFurniture.setAnimation(1);
    }

    async handleActionsInterval(): Promise<void> {
        if(this.unboxingStartedAt === null) {
            return;
        }

        if(performance.now() - this.unboxingStartedAt < 500) {
            return;
        }

        if(this.roomFurniture.model.furniture.customParams) {
            await UserClothesModel.bulkCreate(this.roomFurniture.model.furniture.customParams.map((part) => {
                return {
                    id: randomUUID(),
                    userId: this.roomFurniture.model.userId,
                    part: parseInt(part)
                };
            }), {
                ignoreDuplicates: true
            });
        }
        
        await this.roomFurniture.model.destroy();
        
        this.roomFurniture.room.furnitures.splice(this.roomFurniture.room.furnitures.indexOf(this.roomFurniture), 1);
        
        this.roomFurniture.room.sendProtobuff(RoomFurnitureData, RoomFurnitureData.fromJSON({
            furnitureRemoved: [
                this.roomFurniture.model
            ],
            hideFlyingFurniture: true
        }));
    }
}

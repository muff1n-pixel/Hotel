import { randomUUID } from "crypto";
import RoomUser from "../../Users/RoomUser.js";
import RoomFurniture from "../RoomFurniture.js";
import RoomFurnitureLogic from "./Interfaces/RoomFurnitureLogic.js";
import { FurnitureData, RoomFurnitureData, UserClothingUnlockedData, UseRoomFurnitureData } from "@pixel63/events";
import { game } from "../../../index.js";
import { UserEffectModel } from "../../../Database/Models/Users/Effects/UserEffectModel.js";

export default class RoomFurnitureEnableBoxLogic implements RoomFurnitureLogic {
    private deleteAt?: number;

    constructor(private readonly roomFurniture: RoomFurniture) {

    }

    async use(roomUser: RoomUser, payload: UseRoomFurnitureData): Promise<void> {
        if(roomUser.user.model.id !== this.roomFurniture.model.userId) {
            return;
        }

        if(this.roomFurniture.model.animation !== 0) {
            return;
        }

        if(this.roomFurniture.model.furniture.customParams?.length) {
            await UserEffectModel.bulkCreate(this.roomFurniture.model.furniture.customParams.map((enable) => {
                return {
                    id: randomUUID(),
                    userId: this.roomFurniture.model.userId,
                    enable: parseInt(enable)
                };
            }), {
                ignoreDuplicates: true
            });

            if(this.roomFurniture.model.userId) {
                const user = game.getUserById(this.roomFurniture.model.userId);

                if(user) {
                    user.sendProtobuff(UserClothingUnlockedData, UserClothingUnlockedData.create({
                        furniture: FurnitureData.fromJSON(this.roomFurniture.model.furniture),
                    }));
                }
            }
        }

        await this.roomFurniture.setAnimation(1);

        this.deleteAt = performance.now() + 1000;
    }

    async handleActionsInterval(): Promise<void> {
        if(!this.deleteAt) {
            return;
        }

        if(performance.now() < this.deleteAt) {
            return;
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

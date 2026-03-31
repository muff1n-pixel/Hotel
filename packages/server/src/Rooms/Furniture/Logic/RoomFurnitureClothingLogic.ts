import { randomUUID } from "crypto";
import { UserClothingModel } from "../../../Database/Models/Users/Clothes/UserClothingModel.js";
import RoomUser from "../../Users/RoomUser.js";
import RoomFurniture from "../RoomFurniture.js";
import RoomFurnitureLogic from "./Interfaces/RoomFurnitureLogic.js";
import { RefreshUserClothesData, RoomFurnitureData, UseRoomFurnitureData } from "@pixel63/events";
import { game } from "../../../index.js";

export default class RoomFurnitureClothingLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {

    }

    async use(roomUser: RoomUser, payload: UseRoomFurnitureData): Promise<void> {
        if(roomUser.user.model.id !== this.roomFurniture.model.userId) {
            return;
        }

        if(this.roomFurniture.model.furniture.customParams) {
            await UserClothingModel.bulkCreate(this.roomFurniture.model.furniture.customParams.map((setId) => {
                return {
                    id: randomUUID(),
                    userId: this.roomFurniture.model.userId,
                    setId
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
            hideFlyingFurniture: false
        }));

        if(this.roomFurniture.model.userId) {
            const user = game.getUserById(this.roomFurniture.model.userId);

            if(user) {
                user.sendProtobuff(RefreshUserClothesData, RefreshUserClothesData.create({}));
            }
        }
    }

    async handleActionsInterval(): Promise<void> {
    }
}

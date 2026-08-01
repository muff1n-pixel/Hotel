import { RoomFurnitureData, UserFurnitureCustomData, UserFurnitureData, UseRoomFurnitureData } from "@pixel63/events";
import RoomUser from "../../Users/RoomUser.js";
import RoomFurniture from "../RoomFurniture.js";
import RoomFurnitureLogic from "./Interfaces/RoomFurnitureLogic.js";
import { FurnitureCrackableModel } from "../../../Database/Models/Furniture/Crackable/FurnitureCrackableModel.js";
import { UserFurnitureModel } from "../../../Database/Models/Users/Furniture/UserFurnitureModel.js";
import { randomUUID } from "node:crypto";
import { FurnitureModel } from "../../../Database/Models/Furniture/FurnitureModel.js";
import { UserModel } from "../../../Database/Models/Users/UserModel.js";

export default class RoomFurnitureGiftLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {

    }

    async use(roomUser: RoomUser, payload: UseRoomFurnitureData): Promise<void> {
        if(roomUser.user.model.id !== this.roomFurniture.model.userId) {
            console.warn("User is not owner of gift.");
            
            return;
        }

        await this.roomFurniture.room.handleUserUseFurniture(roomUser, this.roomFurniture);

        this.roomFurniture.setAnimation(1);

        await new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });

        await this.roomFurniture.model.destroy();
        
        this.roomFurniture.room.furnitures.splice(this.roomFurniture.room.furnitures.indexOf(this.roomFurniture), 1);

        const giftFurniture = await UserFurnitureModel.findAll({
            where: {
                userId: this.roomFurniture.model.userId,
                giftId: this.roomFurniture.model.id
            },
            include: [
                {
                    model: FurnitureModel,
                    as: "furniture",

                    include: [
                        {
                            model: FurnitureCrackableModel,
                            as: "crackable"
                        }
                    ]
                },
                {
                    model: UserModel,
                    as: "user"
                }
            ]
        });

        let firstFurniture: UserFurnitureModel | undefined = undefined;

        for(const userFurniture of giftFurniture) {
            await userFurniture.update({
                giftId: null
            });

            if(!firstFurniture) {
                firstFurniture = userFurniture;

                await RoomFurniture.place(this.roomFurniture.room, userFurniture, this.roomFurniture.model.position, null);
            }
            else {
                roomUser.user.getInventory().addFurniture(userFurniture);
            }
        }

        await new Promise((resolve) => {
            setTimeout(resolve, 500);
        });

        this.roomFurniture.room.sendProtobuff(RoomFurnitureData, RoomFurnitureData.fromJSON({
            furnitureRemoved: [
                this.roomFurniture.model
            ],
            hideFlyingFurniture: true
        }));
    }

    async handleActionsInterval(): Promise<void> {
        
    }
}

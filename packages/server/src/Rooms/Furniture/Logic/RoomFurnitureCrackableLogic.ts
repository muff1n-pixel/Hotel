import { RoomFurnitureData, UserFurnitureCustomData, UserFurnitureData, UseRoomFurnitureData } from "@pixel63/events";
import RoomUser from "../../Users/RoomUser.js";
import RoomFurniture from "../RoomFurniture.js";
import RoomFurnitureLogic from "./Interfaces/RoomFurnitureLogic.js";
import { FurnitureCrackableModel } from "../../../Database/Models/Furniture/Crackable/FurnitureCrackableModel.js";
import { UserFurnitureModel } from "../../../Database/Models/Users/Furniture/UserFurnitureModel.js";
import { randomUUID } from "node:crypto";
import { FurnitureModel } from "../../../Database/Models/Furniture/FurnitureModel.js";

export default class RoomFurnitureCrackableLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {

    }

    async use(roomUser: RoomUser, payload: UseRoomFurnitureData): Promise<void> {
        if(!roomUser.hasRights()) {
            console.warn("User does not have rights.");
            
            return;
        }

        const crackable = await this.roomFurniture.model.furniture.getCrackable();

        if(!crackable) {
            throw new Error("Furniture does not have a crackable row.");
        }

        if(this.roomFurniture.model.data?.crackable?.clicks === undefined) {
            this.roomFurniture.model.data = UserFurnitureCustomData.create({
                crackable: {
                    clicks: 0
                }
            });
        }

        if(!this.roomFurniture.model.data.crackable) {
            throw new Error("Failed to initialize crackable data.");
        }

        await this.roomFurniture.room.handleUserUseFurniture(roomUser, this.roomFurniture);

        await this.roomFurniture.model.update({
            data: {
                crackable: {
                    clicks: this.roomFurniture.model.data.crackable.clicks + 1
                }
            }
        });

        console.log("Clicked " + this.roomFurniture.model.data.crackable.clicks + " timed, required " + crackable.requiredClicks);

        if(this.roomFurniture.model.data.crackable.clicks === crackable.requiredClicks) {
            this.roomFurniture.setAnimation(14);

            const reward = await this.getRandomReward(crackable);

            if(!reward) {
                return;
            }

            await new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });

            await this.roomFurniture.model.destroy();
            
            this.roomFurniture.room.furnitures.splice(this.roomFurniture.room.furnitures.indexOf(this.roomFurniture), 1);

            if(this.roomFurniture.model.user) {
                const userFurniture = await UserFurnitureModel.create({
                    id: randomUUID(),
                    position: this.roomFurniture.model.position,
                    direction: null,
                    animation: 0,
                    color: null,
                    data: null,
                    furnitureId: reward.furniture.id,
                    userId: this.roomFurniture.model.user.id,
                    roomId: this.roomFurniture.room.model.id,
                });

                userFurniture.user = this.roomFurniture.model.user;
                userFurniture.furniture = reward.furniture;

                RoomFurniture.place(this.roomFurniture.room, userFurniture, this.roomFurniture.model.position, null);
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
        else if(this.roomFurniture.model.data.crackable.clicks < crackable.requiredClicks) {
            const newAnimation = (this.roomFurniture.model.data.crackable.clicks / crackable.requiredClicks) * 13;

            if(newAnimation !== this.roomFurniture.model.animation) {
                this.roomFurniture.setAnimation(newAnimation);
            }
        }
    }

    async handleActionsInterval(): Promise<void> {
        
    }

    private async getRandomReward(crackable: FurnitureCrackableModel) {
        const rewards = await crackable.getRewards({
            include: [
                {
                    model: FurnitureModel,
                    as: "furniture"
                }
            ]
        });

        if(!rewards) {
            return null;
        }

        const total = rewards.reduce((sum, reward) => sum + reward.chance, 0);

        const random = Math.random() * total;

        let cumulative = 0;

        for (const reward of rewards) {
            cumulative += reward.chance;

            if (random < cumulative) {
                return reward;
            }
        }

        return null;
    }
}
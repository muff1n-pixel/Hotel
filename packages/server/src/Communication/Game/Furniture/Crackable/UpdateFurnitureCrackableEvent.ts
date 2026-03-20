import { FurnitureCrackableData, FurnitureCrackableRewardData, FurnitureData, UpdateFurnitureCrackableData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener";
import User from "../../../../Users/User";
import { FurnitureModel } from "../../../../Database/Models/Furniture/FurnitureModel";
import { FurnitureCrackableModel } from "../../../../Database/Models/Furniture/Crackable/FurnitureCrackableModel";
import { FurnitureCrackableRewardModel } from "../../../../Database/Models/Furniture/Crackable/FurnitureCrackableRewardModel";
import { randomUUID } from "node:crypto";

export default class UpdateFurnitureCrackableEvent implements ProtobuffListener<UpdateFurnitureCrackableData> {
    async handle(user: User, payload: UpdateFurnitureCrackableData) {
        if(!payload.crackable) {
            throw new Error("Validation error.");
        }

        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("furniture:edit")) {
            throw new Error("User does not have edit furniture privileges.");
        }

        const furniture = await FurnitureModel.findByPk(payload.furnitureId, {
            include: [
                {
                    model: FurnitureCrackableModel,
                    as: "crackable"
                }
            ]
        });

        if(!furniture) {
            throw new Error("Furniture does not exist.");
        }

        await furniture.crackable?.destroy();

        const crackable = await FurnitureCrackableModel.create({
            id: randomUUID(),
            furnitureId: furniture.id,
            requiredClicks: payload.crackable?.requiredClicks,
        });

        await FurnitureCrackableRewardModel.bulkCreate(payload.crackable?.rewards.map((reward) => ({
            id: randomUUID(),
            crackableId: crackable.id,
            chance: reward.chance,
            furnitureId: reward.furniture?.id
        })));

        user.sendProtobuff(FurnitureCrackableData, FurnitureCrackableData.create({
            requiredClicks: furniture.crackable?.requiredClicks ?? 0,
            rewards: furniture.crackable?.rewards.map((reward) => FurnitureCrackableRewardData.create({
                chance: reward.chance,
                furniture: FurnitureData.fromJSON(reward.furniture)
            })) ?? []
        }));
    }
}

import { FurnitureCrackableData, FurnitureCrackableRewardData, FurnitureData, FurnitureTypesData, GetFurnitureCrackableData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener";
import User from "../../../../Users/User";
import { FurnitureModel } from "../../../../Database/Models/Furniture/FurnitureModel";
import { FurnitureCrackableModel } from "../../../../Database/Models/Furniture/Crackable/FurnitureCrackableModel";
import { FurnitureCrackableRewardModel } from "../../../../Database/Models/Furniture/Crackable/FurnitureCrackableRewardModel";

export default class GetFurnitureCrackableEvent implements ProtobuffListener<GetFurnitureCrackableData> {
    minimumDurationBetweenEvents?: number = 200;

    async handle(user: User, payload: GetFurnitureCrackableData) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("furniture:edit")) {
            throw new Error("User does not have edit furniture privileges.");
        }

        const furniture = await FurnitureModel.findByPk(payload.furnitureId, {
            include: [
                {
                    model: FurnitureCrackableModel,
                    as: "crackable",

                    include: [
                        {
                            model: FurnitureCrackableRewardModel,
                            as: "rewards",

                            include: [
                                {
                                    model: FurnitureModel,
                                    as: "furniture"
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if(!furniture) {
            throw new Error("Furniture does not exist.");
        }

        user.sendProtobuff(FurnitureCrackableData, FurnitureCrackableData.create({
            requiredClicks: furniture.crackable?.requiredClicks ?? 0,
            rewards: furniture.crackable?.rewards.map((reward) => FurnitureCrackableRewardData.create({
                id: reward.id,
                chance: reward.chance,
                furniture: FurnitureData.fromJSON(reward.furniture)
            })) ?? []
        }));
    }
}

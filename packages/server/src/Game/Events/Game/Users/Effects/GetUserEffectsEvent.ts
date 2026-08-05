import { GetUserClothesData, GetUserEffectsData, UserClothesData, UserEffectsData } from "@pixel63/events";
import { UserProtobuffListener } from "../../../Interfaces/UserProtobuffListener";
import User from "../../../../Users/User";
import { UserClothingModel } from "../../../../../Database/Models/Users/Clothes/UserClothingModel";
import { ClothingModel } from "../../../../../Database/Models/Clothes/ClothesModel";
import { UserEffectModel } from "../../../../../Database/Models/Users/Effects/UserEffectModel";

export default class GetUserEffectsEvent implements UserProtobuffListener<GetUserEffectsData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: User, payload: GetUserEffectsData) {
        const userEffects = await UserEffectModel.findAll({
            where: {
                userId: user.model.id
            }
        });

        user.sendProtobuff(UserEffectsData, UserEffectsData.create({
            effects: userEffects.map((effect) => effect.enable)
        }));
    }
}

import { GetUserClothesData, GetUserEffectsData, UserClothesData, UserEffectsData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener";
import User from "../../../../Users/User";
import { UserClothingModel } from "../../../../Database/Models/Users/Clothes/UserClothingModel";
import { ClothingModel } from "../../../../Database/Models/Clothes/ClothesModel";
import { UserEffectModel } from "../../../../Database/Models/Users/Effects/UserEffectModel";

export default class GetUserEffectsEvent implements ProtobuffListener<GetUserEffectsData> {
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

import { GetUserClothesData, UserClothesData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener";
import User from "../../../../Users/User";
import { UserClothingModel } from "../../../../Database/Models/Users/Clothes/UserClothingModel";
import { ClothingModel } from "../../../../Database/Models/Clothes/ClothesModel";

export default class GetUserClothesEvent implements ProtobuffListener<GetUserClothesData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: User, payload: GetUserClothesData) {
        const clothes = await ClothingModel.findAll({
            where: {
                part: payload.part
            }
        });

        const userClothes = await UserClothingModel.findAll({
            where: {
                userId: user.model.id
            }
        });

        user.sendProtobuff(UserClothesData, UserClothesData.create({
            part: payload.part,

            clothes: clothes.map((clothing) => ({
                id: clothing.id,
                setId: clothing.setId,
                membership: clothing.membership
            })),

            userClothes: userClothes.map((clothing) => ({
                id: clothing.id,
                setId: clothing.setId
            }))
        }));
    }
}

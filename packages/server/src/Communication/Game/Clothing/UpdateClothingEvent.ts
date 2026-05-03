import { GetUserClothesData, UpdateClothingData, UserClothesData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener";
import User from "../../../Users/User";
import { ClothingModel } from "../../../Database/Models/Clothes/ClothesModel";
import { randomUUID } from "node:crypto";
import GetUserClothesEvent from "../Users/Clothes/GetUserClothesEvent";

export default class UpdateClothingEvent implements ProtobuffListener<UpdateClothingData> {
    minimumDurationBetweenEvents?: number = 200;

    async handle(user: User, payload: UpdateClothingData) {
        if(!user.permissions.hasPermission("clothing:edit")) {
            return;
        }

        if(payload.available) {
            await ClothingModel.upsert({
                id: randomUUID(),
                part: payload.part,
                setId: payload.setId,
                membership: payload.membership ?? null
            });
        }
        else {
            await ClothingModel.destroy({
                where: {
                    part: payload.part,
                    setId: payload.setId,
                    membership: payload.membership ?? null
                }
            });
        }

        await (new GetUserClothesEvent()).handle(user, GetUserClothesData.create({
            part: payload.part
        }));
    }
}

import User from "../../../../Users/User.js";
import { randomUUID } from "node:crypto";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import { GetShopPagePetsData, UpdateShopPetData } from "@pixel63/events";
import { ShopPagePetModel } from "../../../../Database/Models/Shop/ShopPagePetModel.js";
import GetShopPagePetsEvent from "../GetShopPagePetsEvent.js";
import { PetModel } from "../../../../Database/Models/Pets/PetModel.js";

export default class UpdateShopPetEvent implements ProtobuffListener<UpdateShopPetData> {
    minimumDurationBetweenEvents?: number = 1000;

    async handle(user: User, payload: UpdateShopPetData) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("shop:edit")) {
            throw new Error("User is not privileged to edit the shope.");
        }

        const pet = await PetModel.findOne({
            where: {
                id: payload.petId
            }
        });

        if(!pet) {
            return;
        }

        if(payload.id !== undefined) {
            await ShopPagePetModel.update({
                petId: pet.id,

                credits: (payload.credits > 0)?(payload.credits):(null),
                duckets: (payload.duckets > 0)?(payload.duckets):(null),
                diamonds: (payload.diamonds > 0)?(payload.diamonds):(null),
            }, {
                where: {
                    id: payload.id
                }
            });
        }
        else {
            await ShopPagePetModel.create({
                id: randomUUID(),
                
                shopPageId: payload.pageId,

                petId: pet.id,

                credits: (payload.credits > 0)?(payload.credits):(null),
                duckets: (payload.duckets > 0)?(payload.duckets):(null),
                diamonds: (payload.diamonds > 0)?(payload.diamonds):(null),
            });
        }

        await (new GetShopPagePetsEvent()).handle(user, GetShopPagePetsData.create({
            pageId: payload.pageId
        }));
    }
}

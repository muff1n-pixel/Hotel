import User from "../../../Users/User.js";
import { FurnitureModel } from "../../../Database/Models/Furniture/FurnitureModel.js";
import { randomUUID } from "node:crypto";
import { PurchaseShopPetData, RoomPositionData, ShopFurniturePurchaseData, UserFurnitureCustomData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { ShopPagePetModel } from "../../../Database/Models/Shop/ShopPagePetModel.js";
import { UserPetModel } from "../../../Database/Models/Users/Pets/UserPetModel.js";
import { PetModel } from "../../../Database/Models/Pets/PetModel.js";

export default class PurchaseShopPetEvent implements ProtobuffListener<PurchaseShopPetData> {
    async handle(user: User, payload: PurchaseShopPetData) {
        const shopPet = await ShopPagePetModel.findOne({
            where: {
                id: payload.id
            },
            include: [
                {
                    model: PetModel,
                    as: "pet"
                }
            ]
        });

        if(!shopPet) {
            throw new Error("Shop pet does not exist.");
        }

        if((shopPet.credits && user.model.credits < shopPet.credits)) {
            return;
        }

        if((shopPet.duckets && user.model.duckets < shopPet.duckets)) {
            return;
        }

        if((shopPet.diamonds && user.model.diamonds < shopPet.diamonds)) {
            return;
        }

        if(payload.name.length === 0 || payload.name.length > 24) {
            throw new Error("Payload name is too short or too long.");
        }

        user.model.credits -= shopPet.credits ?? 0;
        user.model.duckets -= shopPet.duckets ?? 0;
        user.model.diamonds -= shopPet.diamonds ?? 0;

        await user.model.save();

        const userPet = await UserPetModel.create({
            id: randomUUID(),

            position: RoomPositionData.create(),
            direction: 0,

            name: payload.name,
        
            roomId: null,
            userId: user.model.id,
            petId: shopPet.pet.id
        });

        userPet.user = user.model;
        userPet.pet = shopPet.pet;

        //await user.getInventory().addPet(userFurniture);

        user.sendUserData();
    }
}

import User from "../../../Users/User.js";
import { ShopPageModel } from "../../../Database/Models/Shop/ShopPageModel.js";
import { GetShopPagePetsData, ShopPagePetsData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { ShopPagePetModel } from "../../../Database/Models/Shop/ShopPagePetModel.js";
import { PetModel } from "../../../Database/Models/Pets/PetModel.js";

export default class GetShopPagePetsEvent implements ProtobuffListener<GetShopPagePetsData> {
    async handle(user: User, payload: GetShopPagePetsData) {
        const shopPage = await ShopPageModel.findByPk(payload.pageId, {
            include: {
                model: ShopPagePetModel,
                as: "pets",

                include: [
                    {
                        model: PetModel,
                        as: "pet"
                    }
                ]
            }
        });

        if(!shopPage) {
            throw new Error("Shop page does not exist.");
        }

        user.sendProtobuff(ShopPagePetsData, ShopPagePetsData.create({
            pageId: shopPage.id,
            pets: shopPage.pets.map((shopPet) => {
                return {
                    id: shopPet.id,

                    pet: {
                        id: shopPet.pet.id,
                        type: shopPet.pet.type,

                        name: shopPet.pet.name,
                        description: shopPet.pet.description
                    },
                    
                    credits: shopPet.credits,
                    duckets: shopPet.duckets,
                    diamonds: shopPet.diamonds
                }
            })
        }));
    }
}
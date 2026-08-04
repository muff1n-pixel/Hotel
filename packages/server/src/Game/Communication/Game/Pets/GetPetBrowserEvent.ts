import User from "../../../Users/User.js";
import { GetPetBrowserData, PetBrowserData, PetData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { PetModel } from "../../../Database/Models/Pets/PetModel.js";
import { PetBreedModel } from "../../../Database/Models/Pets/PetBreedModel.js";
import { Op } from "sequelize";

export default class GetPetBrowserEvent implements ProtobuffListener<GetPetBrowserData> {
    async handle(user: User, payload: GetPetBrowserData) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("pets:view")) {
            throw new Error("User does not have appropriate privileges.");
        }

        const { rows: pets, count } = await PetModel.findAndCountAll({
            limit: 20,
            offset: payload.offset,

            where: {
                ...(payload.searchId.length && {
                    id: payload.searchId
                }),
                
                ...(payload.searchType.length && {
                    type: {
                        [Op.like]: `%${payload.searchType}%`
                    }
                }),
            },

            include: [
                {
                    model: PetBreedModel,
                    as: "breed",
                    required: true,

                    where: {
                        ...(payload.searchBreed.length && {
                            name: {
                                [Op.like]: `%${payload.searchBreed}%`
                            }
                        }),
                    }
                }
            ],

            order: ["type", "breedId"]
        });

        user.sendProtobuff(PetBrowserData, PetBrowserData.create({
            pets: pets.map((pet) => PetData.fromJSON(pet)),
            count
        }));
    }
}

import User from "../../../Users/User.js";
import { GetPetBreedsData, PetBreedData, PetBreedsData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { PetBreedModel } from "../../../Database/Models/Pets/PetBreedModel.js";

export default class GetPetBreedsEvent implements ProtobuffListener<GetPetBreedsData> {
    async handle(user: User, payload: GetPetBreedsData) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("pets:view")) {
            throw new Error("User does not have view pets privileges.");
        }

        const breeds = await PetBreedModel.findAll({
            where: {
                type: payload.type
            }
        });

        user.sendProtobuff(PetBreedsData, PetBreedsData.create({
            type: payload.type,
            breeds: breeds.map((breed) => PetBreedData.fromJSON(breed))
        }));
    }
}

import User from "../../../Users/User.js";
import { GetPetBrowserData, PetBrowserData, PetData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { PetModel } from "../../../Database/Models/Pets/PetModel.js";
import { PetBreedModel } from "../../../Database/Models/Pets/PetBreedModel.js";

export default class GetPetBrowserEvent implements ProtobuffListener<GetPetBrowserData> {
    async handle(user: User, payload: GetPetBrowserData) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("pets:view")) {
            throw new Error("User does not have appropriate privileges.");
        }

        const count = await PetModel.count();

        if(payload.offset > count) {
            throw new Error("Offset exceeds count.");
        }

        const pets = await PetModel.findAll({
            limit: 20,
            offset: payload.offset,

            include: [
                {
                    model: PetBreedModel,
                    as: "breed"
                }
            ],

            order: ["breedId"]
        });

        user.sendProtobuff(PetBrowserData, PetBrowserData.create({
            pets: pets.map((pet) => PetData.fromJSON(pet)),
            count
        }));
    }
}

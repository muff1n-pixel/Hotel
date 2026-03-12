import User from "../../../Users/User.js";
import { game } from "../../../index.js";
import { GetPetBrowserData, RoomFurnitureData, UpdatePetData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { PetModel } from "../../../Database/Models/Pets/PetModel.js";
import { PetBreedModel } from "../../../Database/Models/Pets/PetBreedModel.js";
import { randomUUID } from "node:crypto";
import GetPetBrowserEvent from "./GetPetBrowserEvent.js";

export default class UpdatePetEvent implements ProtobuffListener<UpdatePetData> {
    async handle(user: User, payload: UpdatePetData) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("pets:edit")) {
            throw new Error("User does not have edit pets privileges.");
        }

        const breed = (payload.breedName)?(
            await PetBreedModel.findOrCreate({
                defaults: {
                    id: randomUUID(),

                    type: payload.type,
                    name: payload.breedName,
                    index: payload.breedIndex
                },
                where: {
                    type: payload.type,
                    name: payload.breedName,
                    index: payload.breedIndex
                }
            })
        ):(null);

        const pet = await PetModel.upsert({
            id: payload.id ?? randomUUID(),

            type: payload.type,
            name: payload.name,
            palettes: payload.palettes,
            breedId: breed?.[0].id,
        });

        for(const room of game.roomManager.instances) {
            const affectedPets = room.pets.filter((userPet) => userPet.model.pet.id === pet[0].id);

            const petsUpdated: RoomFurnitureData[] = [];

            for(const userFurniture of affectedPets) {
                userFurniture.model.pet = pet[0];

                petsUpdated.push(RoomFurnitureData.fromJSON(userFurniture.model));
            }

            if(petsUpdated.length) {
                room.sendProtobuff(RoomFurnitureData, RoomFurnitureData.fromJSON({
                    petsUpdated
                }));
            }
        }

        new GetPetBrowserEvent().handle(user, GetPetBrowserData.create({
            offset: 0
        }));
    }
}

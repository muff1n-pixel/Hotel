import { clientInstance } from "../../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { RoomPetExperiencePointsData, RoomPetsData } from "@pixel63/events";
import RoomPet from "@Client/Room/Pets/RoomPet";

export default class RoomPetExperiencePointsEvent implements ProtobuffListener<RoomPetExperiencePointsData> {
    async handle(payload: RoomPetExperiencePointsData) {
        if(!clientInstance.roomInstance.value) {
            throw new Error("Room instance is not created.");
        }

        const pet = clientInstance.roomInstance.value.getPetById(payload.petId);

        pet.item.setExperiencePointsSprite(payload.experience);
    }
}

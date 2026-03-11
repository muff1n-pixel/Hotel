import { clientInstance } from "../../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { RoomPetsData } from "@pixel63/events";
import RoomPet from "@Client/Room/Pets/RoomPet";

export default class RoomPetsEvent implements ProtobuffListener<RoomPetsData> {
    async handle(payload: RoomPetsData) {
        if(!clientInstance.roomInstance.value) {
            throw new Error("Room instance is not created.");
        }

        if(payload.petsUpdated?.length) {
            for(const data of payload.petsUpdated) {
                const pet = clientInstance.roomInstance.value.getPetById(data.id);

                pet.updateData(data);
            }
        }

        if(payload.petsAdded?.length) {
            clientInstance.roomInstance.value.pets.push(...payload.petsAdded.map((botData) => new RoomPet(clientInstance.roomInstance.value!, botData)));
        }

        if(payload.petsRemoved?.length) {
            payload.petsRemoved.forEach((botData) => {
                clientInstance.roomInstance.value!.removePet(botData.id);
            });
        }

        clientInstance.roomInstance.update();
    }
}
